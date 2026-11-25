import { ShopManager } from '../editor/shopData.js';

const BANK_KEY = 'runner_bank_state';

function notifyBankAndCoins() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('runner:bank-updated'));
    window.dispatchEvent(new CustomEvent('runner:coins-updated'));
  }
}

function createMigratedState() {
  const legacyCoins = ShopManager.getCoins();
  let startBank = 30;
  const transactions = [];

  if (legacyCoins > 80) {
    // Rebalance bloated legacy wallets so saving up feels exciting again
    ShopManager.setCoins(25);
    startBank = Math.min(120, Math.max(40, Math.round(legacyCoins * 0.04)));
    transactions.push({
      id: `tx_${Date.now()}`,
      kind: 'in',
      label: '⚖️ Konto-Ausgleich (Sparen macht wieder Spaß!)',
      amount: startBank,
      at: Date.now()
    });
  } else if (legacyCoins > 25) {
    const movedToBank = legacyCoins - 25;
    ShopManager.setCoins(25);
    startBank = 20 + movedToBank;
    transactions.push({
      id: `tx_${Date.now()}`,
      kind: 'in',
      label: '🏦 Start-Sparguthaben',
      amount: startBank,
      at: Date.now()
    });
  } else {
    transactions.push({
      id: `tx_${Date.now()}`,
      kind: 'in',
      label: '🏦 Willkommens-Konto',
      amount: startBank,
      at: Date.now()
    });
  }

  return {
    bankBalance: startBank,
    transactions,
    rebalancedV1: true
  };
}

export const BankManager = {
  getState() {
    try {
      const raw = localStorage.getItem(BANK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.rebalancedV1) {
          return {
            bankBalance: Math.max(0, Math.floor(parsed.bankBalance || 0)),
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
            rebalancedV1: true
          };
        }
      }
    } catch {
      // fall through to migration
    }

    const migrated = createMigratedState();
    this.saveState(migrated);
    return migrated;
  },

  saveState(state) {
    try {
      const trimmed = {
        bankBalance: Math.max(0, Math.floor(state.bankBalance || 0)),
        transactions: Array.isArray(state.transactions) ? state.transactions.slice(0, 24) : [],
        rebalancedV1: true
      };
      localStorage.setItem(BANK_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore storage errors
    }
  },

  getBalance() {
    return this.getState().bankBalance;
  },

  getTransactions() {
    return this.getState().transactions;
  },

  depositEarned(amount, label = '💰 Einnahmen') {
    const safe = Math.max(0, Math.floor(amount || 0));
    if (safe <= 0) return this.getBalance();
    const state = this.getState();
    state.bankBalance += safe;
    state.transactions.unshift({
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kind: 'in',
      label,
      amount: safe,
      at: Date.now()
    });
    this.saveState(state);
    notifyBankAndCoins();
    return state.bankBalance;
  },

  withdrawToWallet(amount) {
    const req = Math.max(0, Math.floor(amount || 0));
    if (req <= 0) return { ok: false, reason: 'invalid' };
    const state = this.getState();
    if (state.bankBalance < req) {
      return { ok: false, reason: 'insufficient_bank', available: state.bankBalance };
    }
    state.bankBalance -= req;
    state.transactions.unshift({
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kind: 'out',
      label: '🏧 Geld abgehoben (Portemonnaie)',
      amount: req,
      at: Date.now()
    });
    this.saveState(state);
    const wallet = ShopManager.addCoins(req);
    notifyBankAndCoins();
    return { ok: true, amount: req, bankBalance: state.bankBalance, wallet };
  },

  depositFromWallet(amount) {
    const req = Math.max(0, Math.floor(amount || 0));
    if (req <= 0) return { ok: false, reason: 'invalid' };
    const wallet = ShopManager.getCoins();
    if (wallet < req) {
      return { ok: false, reason: 'insufficient_wallet', available: wallet };
    }
    const newWallet = ShopManager.setCoins(wallet - req);
    const state = this.getState();
    state.bankBalance += req;
    state.transactions.unshift({
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kind: 'in',
      label: '💵 Bargeld eingezahlt',
      amount: req,
      at: Date.now()
    });
    this.saveState(state);
    notifyBankAndCoins();
    return { ok: true, amount: req, bankBalance: state.bankBalance, wallet: newWallet };
  },

  resetMoneyForChallenge(walletAmount = 25, bankAmount = 0) {
    const safeWallet = Math.max(0, Math.floor(walletAmount));
    const safeBank = Math.max(0, Math.floor(bankAmount));
    ShopManager.setCoins(safeWallet);
    const state = {
      bankBalance: safeBank,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          kind: 'reset',
          label: `🔄 Neu gestartet (${safeWallet} 🪙 Bargeld, ${safeBank} 🪙 Bank)`,
          amount: safeWallet + safeBank,
          at: Date.now()
        }
      ],
      rebalancedV1: true
    };
    this.saveState(state);
    notifyBankAndCoins();
    return { ok: true, wallet: safeWallet, bankBalance: safeBank };
  }
};

// Ensure level-up bonuses automatically deposit into the Bank account
ShopManager.setLevelUpPayoutHandler((bonusCoins, newLevel) => {
  if (bonusCoins > 0) {
    BankManager.depositEarned(bonusCoins, `🏆 Level ${newLevel} Bonus`);
  }
});
