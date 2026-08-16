package com.cloudcostx.service.impl;

import com.cloudcostx.entity.CloudAccount;
import com.cloudcostx.entity.CloudAccountStatus;
import com.cloudcostx.entity.Notification;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.CloudAccountRepository;
import com.cloudcostx.repository.NotificationRepository;
import com.cloudcostx.service.CloudAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CloudAccountServiceImpl implements CloudAccountService {

    @Autowired
    private CloudAccountRepository cloudAccountRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<CloudAccount> getAllAccounts() {
        return cloudAccountRepository.findAll();
    }

    @Override
    public CloudAccount getAccountById(String id) {
        return cloudAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cloud account not found with ID: " + id));
    }

    @Override
    @Transactional
    public CloudAccount createAccount(CloudAccount account) {
        if (account.getId() == null) {
            account.setId(account.getProvider().name().toLowerCase() + "-" + java.util.UUID.randomUUID().toString().substring(0, 4));
        }
        if (account.getStatus() == null) {
            account.setStatus(CloudAccountStatus.CONNECTED);
        }
        return cloudAccountRepository.save(account);
    }

    @Override
    @Transactional
    public CloudAccount updateAccount(String id, CloudAccount accountDetails) {
        CloudAccount account = getAccountById(id);
        account.setAccountName(accountDetails.getAccountName());
        account.setAccountIdentifier(accountDetails.getAccountIdentifier());
        account.setRegion(accountDetails.getRegion());
        if (accountDetails.getStatus() != null) {
            account.setStatus(accountDetails.getStatus());
        }
        return cloudAccountRepository.save(account);
    }

    @Override
    @Transactional
    public void deleteAccount(String id) {
        CloudAccount account = getAccountById(id);
        cloudAccountRepository.delete(account);
    }

    @Override
    @Transactional
    public void syncAccount(String id) {
        CloudAccount account = getAccountById(id);
        account.setStatus(CloudAccountStatus.CONNECTED);
        account.setLastSyncedAt(LocalDateTime.now());
        cloudAccountRepository.save(account);

        // Generate sync notification alert
        Notification notification = Notification.builder()
                .id("n-sync-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Successfully synchronized CUR billing ledger for cloud account: " + account.getAccountName())
                .type("success")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
