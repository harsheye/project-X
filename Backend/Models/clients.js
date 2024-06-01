const mongoose = require('mongoose');

const transactionObject = {
  transaction_id: {
    type: String,
    default: 'admin00000000admin'
  },
  type: {
    type: String,
    default: 'deposit'
  },
  money: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
};

transactionObject.timestamp.getHour = function() {
  return new Date(this.valueOf()).getUTCHours();
};

transactionObject.timestamp.getMinute = function() {
  return new Date(this.valueOf()).getUTCMinutes();
};

const vaultObject = {
  no: {
    type: Number,
    default: 1
  },
  balance: {
    type: Number,
    default: 0
  },
  days: {
    type: Number,
    default: 10
  }
};

const transaction_key = () => {
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  balance: {
    type: Number,
    default: 0
  },
  transaction_key: {
    type: String,
    unique: true,
    default: transaction_key
  },
  transaction_limit: {
    type: Number,
    default: 20
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  transactions: {
    type: [transactionObject],
    default: [transactionObject]
  },
  vault: {
    type: [vaultObject],
    default: [vaultObject]
  }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
