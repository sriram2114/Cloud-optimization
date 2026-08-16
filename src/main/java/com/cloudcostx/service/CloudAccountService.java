package com.cloudcostx.service;

import com.cloudcostx.entity.CloudAccount;
import java.util.List;

public interface CloudAccountService {
    List<CloudAccount> getAllAccounts();
    CloudAccount getAccountById(String id);
    CloudAccount createAccount(CloudAccount account);
    CloudAccount updateAccount(String id, CloudAccount account);
    void deleteAccount(String id);
    void syncAccount(String id);
}
