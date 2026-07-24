package com.ecommerce.thriftauction.features.payment.entity;

public enum TransactionType {
    DEPOSIT, WITHDRAW, PAYMENT, ESCROW_HOLD, ESCROW_RELEASE, REFUND, BOOST_FEE, WITHDRAWAL_FEE, AUCTION_DEPOSIT,
    AUCTION_REFUND, COMMISSION
}
