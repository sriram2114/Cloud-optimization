package com.cloudcostx.config;

import com.cloudcostx.entity.*;
import com.cloudcostx.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CloudAccountRepository cloudAccountRepository;

    @Autowired
    private CloudResourceRepository cloudResourceRepository;

    @Autowired
    private CostTagRepository costTagRepository;

    @Autowired
    private StorageUsageRepository storageUsageRepository;

    @Autowired
    private NetworkUsageRepository networkUsageRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private GovernancePolicyRepository governancePolicyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CostRecordRepository costRecordRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedUsers();
        seedProjects();
        seedCloudAccounts();
        seedResources();
        seedBudgets();
        seedGovernancePolicies();
        seedHistoricalCosts();
        seedAlertsAndNotifications();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // ADMIN user
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@cloudcostx.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);

            // FINANCE user
            User finance = User.builder()
                    .name("Finance Analyst")
                    .email("finance@cloudcostx.com")
                    .password(passwordEncoder.encode("finance123"))
                    .role(Role.FINANCE)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(finance);

            // DEVOPS user
            User devops = User.builder()
                    .name("DevOps Engineer")
                    .email("devops@cloudcostx.com")
                    .password(passwordEncoder.encode("devops123"))
                    .role(Role.DEVOPS)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(devops);

            System.out.println(">>> Demo users seeded successfully!");
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            Project prod = Project.builder()
                    .name("Core API Infrastructure")
                    .description("Primary API runtime services and databases for product delivery")
                    .department("Engineering")
                    .environment(Environment.PRODUCTION)
                    .costCenter("CC-ENG-01")
                    .owner("DevOps Team")
                    .status("ACTIVE")
                    .build();
            projectRepository.save(prod);

            Project analytics = Project.builder()
                    .name("Analytics Pipeline")
                    .description("Big Data warehousing cluster and ingestion topics")
                    .department("Data Science")
                    .environment(Environment.STAGING)
                    .costCenter("CC-DATA-02")
                    .owner("Finance Team")
                    .status("ACTIVE")
                    .build();
            projectRepository.save(analytics);

            Project portal = Project.builder()
                    .name("Marketing Portal")
                    .description("Public web app portal and static landing pages")
                    .department("Marketing")
                    .environment(Environment.DEVELOPMENT)
                    .costCenter("CC-MKT-03")
                    .owner("Dev Team")
                    .status("ACTIVE")
                    .build();
            projectRepository.save(portal);

            System.out.println(">>> Corporate projects seeded successfully!");
        }
    }

    private void seedCloudAccounts() {
        if (cloudAccountRepository.count() == 0) {
            CloudAccount aws = CloudAccount.builder()
                    .id("aws-production")
                    .provider(Provider.AWS)
                    .accountName("AWS Prod Account")
                    .accountIdentifier("123456789012")
                    .region("ap-south-1")
                    .status(CloudAccountStatus.CONNECTED)
                    .lastSyncedAt(LocalDateTime.now())
                    .build();
            cloudAccountRepository.save(aws);

            CloudAccount azure = CloudAccount.builder()
                    .id("azure-enterprise")
                    .provider(Provider.AZURE)
                    .accountName("Azure Enterprise Sub")
                    .accountIdentifier("sub-9876-5432-11")
                    .region("eastus")
                    .status(CloudAccountStatus.CONNECTED)
                    .lastSyncedAt(LocalDateTime.now())
                    .build();
            cloudAccountRepository.save(azure);

            CloudAccount gcp = CloudAccount.builder()
                    .id("gcp-analytics")
                    .provider(Provider.GCP)
                    .accountName("GCP BigQuery Project")
                    .accountIdentifier("gcp-analytics-prod")
                    .region("us-central1")
                    .status(CloudAccountStatus.CONNECTED)
                    .lastSyncedAt(LocalDateTime.now())
                    .build();
            cloudAccountRepository.save(gcp);

            System.out.println(">>> Cloud Accounts connected successfully!");
        }
    }

    private void seedResources() {
        if (cloudResourceRepository.count() == 0) {
            Project prodProj = projectRepository.findByName("Core API Infrastructure").orElse(null);
            Project analyticsProj = projectRepository.findByName("Analytics Pipeline").orElse(null);
            Project portalProj = projectRepository.findByName("Marketing Portal").orElse(null);

            CloudAccount awsAcc = cloudAccountRepository.findById("aws-production").orElse(null);
            CloudAccount azureAcc = cloudAccountRepository.findById("azure-enterprise").orElse(null);
            CloudAccount gcpAcc = cloudAccountRepository.findById("gcp-analytics").orElse(null);

            // Resource 1: AWS Underutilized Compute VM
            CloudResource ec2 = CloudResource.builder()
                    .id("res-ec2-prod-01")
                    .resourceName("AWS EC2 Production Cluster")
                    .provider(Provider.AWS)
                    .resourceType(ResourceType.COMPUTE)
                    .region("ap-south-1")
                    .instanceType("m5.2xlarge")
                    .cpuUsage(14) // < 20 triggers right sizing recommendation
                    .memoryUsage(32)
                    .monthlyCost(BigDecimal.valueOf(18500))
                    .status(ResourceStatus.UNDERUTILIZED)
                    .environment(Environment.PRODUCTION)
                    .project(prodProj)
                    .cloudAccount(awsAcc)
                    .build();
            cloudResourceRepository.save(ec2);
            seedTags(ec2, "Core API Infrastructure", "DevOps Team", "Production", "CC-ENG-01");

            // Resource 2: AWS Compliant Database
            CloudResource rds = CloudResource.builder()
                    .id("res-rds-prod-02")
                    .resourceName("AWS RDS PostgreSQL Database")
                    .provider(Provider.AWS)
                    .resourceType(ResourceType.DATABASE)
                    .region("ap-south-1")
                    .instanceType("db.r5.xlarge")
                    .cpuUsage(52)
                    .memoryUsage(65)
                    .monthlyCost(BigDecimal.valueOf(24000))
                    .status(ResourceStatus.ACTIVE)
                    .environment(Environment.PRODUCTION)
                    .project(prodProj)
                    .cloudAccount(awsAcc)
                    .build();
            cloudResourceRepository.save(rds);
            seedTags(rds, "Core API Infrastructure", "DevOps Team", "Production", "CC-ENG-01");

            // Resource 3: AWS S3 Stale Storage Bucket
            CloudResource s3 = CloudResource.builder()
                    .id("res-s3-prod-03")
                    .resourceName("AWS S3 Corporate Backups-Public") // "Public" triggers public access warning
                    .provider(Provider.AWS)
                    .resourceType(ResourceType.STORAGE)
                    .region("ap-south-1")
                    .storageSize(1500L) // 1.5 TB
                    .monthlyCost(BigDecimal.valueOf(8000))
                    .status(ResourceStatus.NON_COMPLIANT)
                    .environment(Environment.PRODUCTION)
                    .project(prodProj)
                    .cloudAccount(awsAcc)
                    .build();
            cloudResourceRepository.save(s3);
            // Intentionally missing Project/Owner tags to trigger mandatory tag violations scans!
            costTagRepository.save(CostTag.builder().resource(s3).tagKey("Environment").tagValue("Production").build());

            // Storage Details Linkage
            StorageUsage storageUsage = StorageUsage.builder()
                    .id("st-01")
                    .resource(s3)
                    .storageType("S3 Standard Object Storage")
                    .storageSize("1500 GB")
                    .ageDays(210) // > 180 triggers Archive transition rule
                    .currentTier(StorageTier.HOT)
                    .recommendedTier(StorageTier.ARCHIVE)
                    .monthlyCost(BigDecimal.valueOf(8000))
                    .potentialSaving(BigDecimal.valueOf(5500))
                    .build();
            storageUsageRepository.save(storageUsage);

            // Resource 4: Azure VM active
            CloudResource azureVm = CloudResource.builder()
                    .id("res-azure-vm-01")
                    .resourceName("Azure VM AppServer")
                    .provider(Provider.AZURE)
                    .resourceType(ResourceType.COMPUTE)
                    .region("eastus")
                    .instanceType("Standard_D4s_v3")
                    .cpuUsage(68)
                    .memoryUsage(74)
                    .monthlyCost(BigDecimal.valueOf(12000))
                    .status(ResourceStatus.ACTIVE)
                    .environment(Environment.STAGING)
                    .project(analyticsProj)
                    .cloudAccount(azureAcc)
                    .build();
            cloudResourceRepository.save(azureVm);
            seedTags(azureVm, "Analytics Pipeline", "Finance Team", "Staging", "CC-DATA-02");

            // Resource 5: Azure VM GPU unapproved high tier
            CloudResource azureGpu = CloudResource.builder()
                    .id("res-azure-vm-02")
                    .resourceName("Azure VM GPU Machine")
                    .provider(Provider.AZURE)
                    .resourceType(ResourceType.COMPUTE)
                    .region("eastus")
                    .instanceType("Standard_NC6") // unapproved GPU triggers compliance drift alert
                    .cpuUsage(4) // < 5 triggers unused resource violation warning!
                    .memoryUsage(12)
                    .monthlyCost(BigDecimal.valueOf(16000))
                    .status(ResourceStatus.NON_COMPLIANT)
                    .environment(Environment.STAGING)
                    .project(analyticsProj)
                    .cloudAccount(azureAcc)
                    .build();
            cloudResourceRepository.save(azureGpu);
            seedTags(azureGpu, "Analytics Pipeline", "Finance Team", "Staging", "CC-DATA-02");

            // Resource 6: GCP BigQuery Database
            CloudResource gcpBq = CloudResource.builder()
                    .id("res-gcp-bq-01")
                    .resourceName("GCP BigQuery Analytics DB")
                    .provider(Provider.GCP)
                    .resourceType(ResourceType.DATABASE)
                    .region("us-central1")
                    .monthlyCost(BigDecimal.valueOf(10000))
                    .status(ResourceStatus.ACTIVE)
                    .environment(Environment.DEVELOPMENT)
                    .project(portalProj)
                    .cloudAccount(gcpAcc)
                    .build();
            cloudResourceRepository.save(gcpBq);
            seedTags(gcpBq, "Marketing Portal", "Dev Team", "Development", "CC-MKT-03");

            // Resource 7: GCP Cloud Storage
            CloudResource gcpStorage = CloudResource.builder()
                    .id("res-gcp-gcs-02")
                    .resourceName("GCP Cloud Storage Assets")
                    .provider(Provider.GCP)
                    .resourceType(ResourceType.STORAGE)
                    .region("us-central1")
                    .storageSize(500L)
                    .monthlyCost(BigDecimal.valueOf(3200))
                    .status(ResourceStatus.ACTIVE)
                    .environment(Environment.DEVELOPMENT)
                    .project(portalProj)
                    .cloudAccount(gcpAcc)
                    .build();
            cloudResourceRepository.save(gcpStorage);
            seedTags(gcpStorage, "Marketing Portal", "Dev Team", "Development", "CC-MKT-03");

            // Seed Network traffic link
            NetworkUsage networkUsage = NetworkUsage.builder()
                    .id("net-01")
                    .sourceRegion("ap-south-1")
                    .destinationRegion("ap-southeast-1")
                    .provider(Provider.AWS)
                    .transferType(NetworkTransferType.INTERNET_EGRESS)
                    .dataTransferGb(BigDecimal.valueOf(25000))
                    .cost(BigDecimal.valueOf(8500)) // > 5000 triggers network optimization recommendation rule
                    .riskLevel(NetworkRisk.HIGH)
                    .recommendation("Egress traffic Mumbai-Singapore exceeds cost targets. Route traffic via CDN cache.")
                    .build();
            networkUsageRepository.save(networkUsage);

            System.out.println(">>> Cloud inventory and usages seeded successfully!");
        }
    }

    private void seedTags(CloudResource res, String project, String owner, String env, String costCenter) {
        costTagRepository.save(CostTag.builder().resource(res).tagKey("Project").tagValue(project).build());
        costTagRepository.save(CostTag.builder().resource(res).tagKey("Owner").tagValue(owner).build());
        costTagRepository.save(CostTag.builder().resource(res).tagKey("Environment").tagValue(env).build());
        costTagRepository.save(CostTag.builder().resource(res).tagKey("CostCenter").tagValue(costCenter).build());
    }

    private void seedBudgets() {
        if (budgetRepository.count() == 0) {
            Project prodProj = projectRepository.findByName("Core API Infrastructure").orElse(null);
            Project analyticsProj = projectRepository.findByName("Analytics Pipeline").orElse(null);

            Budget prodBudget = Budget.builder()
                    .id("b-corp-ops")
                    .budgetName("Core Services Ops Budget")
                    .project(prodProj)
                    .department("Engineering")
                    .monthlyLimit(BigDecimal.valueOf(60000))
                    .currentSpend(BigDecimal.valueOf(50500))
                    .alertThreshold(BigDecimal.valueOf(80.00)) // 80% of 60k is 48k. spent is 50.5k -> WARNING status!
                    .forecastedCost(BigDecimal.valueOf(54000))
                    .startDate(LocalDate.now().withDayOfMonth(1))
                    .endDate(LocalDate.now().withDayOfMonth(1).plusMonths(6))
                    .status(BudgetStatus.WARNING)
                    .build();
            budgetRepository.save(prodBudget);

            Budget analyticsBudget = Budget.builder()
                    .id("b-analytics")
                    .budgetName("Data Pipeline Sub-Budget")
                    .project(analyticsProj)
                    .department("Data Science")
                    .monthlyLimit(BigDecimal.valueOf(20000))
                    .currentSpend(BigDecimal.valueOf(28000)) // spent is 28k > 20k limit -> EXCEEDED status!
                    .alertThreshold(BigDecimal.valueOf(80.00))
                    .forecastedCost(BigDecimal.valueOf(30500))
                    .startDate(LocalDate.now().withDayOfMonth(1))
                    .endDate(LocalDate.now().withDayOfMonth(1).plusMonths(6))
                    .status(BudgetStatus.EXCEEDED)
                    .build();
            budgetRepository.save(analyticsBudget);

            System.out.println(">>> Budgets configurations seeded successfully!");
        }
    }

    private void seedGovernancePolicies() {
        if (governancePolicyRepository.count() == 0) {
            governancePolicyRepository.save(GovernancePolicy.builder()
                    .id("pol-tags")
                    .policyName("Enforce Mandatory Cost Center Tags")
                    .description("Requires Project, Owner, Environment, and CostCenter tag keys on all resources.")
                    .policyType(PolicyType.MANDATORY_TAG)
                    .enabled(true)
                    .build());

            governancePolicyRepository.save(GovernancePolicy.builder()
                    .id("pol-budgets")
                    .policyName("Enforce Project Budget Overrun Guard")
                    .description("Checks budget projections; flags instances in projects exceeding the 100% threshold.")
                    .policyType(PolicyType.BUDGET_LIMIT)
                    .enabled(true)
                    .build());

            governancePolicyRepository.save(GovernancePolicy.builder()
                    .id("pol-unapproved")
                    .policyName("Disallow High-Memory GPU Workloads")
                    .description("Blocks VM types belonging to high-tier compute classes without team request logs.")
                    .policyType(PolicyType.UNAPPROVED_RESOURCE)
                    .enabled(true)
                    .build());

            governancePolicyRepository.save(GovernancePolicy.builder()
                    .id("pol-public")
                    .policyName("Restrict Anonymous Storage Permissions")
                    .description("Enforce private access lists on standard Cloud storage buckets.")
                    .policyType(PolicyType.PUBLIC_STORAGE)
                    .enabled(true)
                    .build());

            governancePolicyRepository.save(GovernancePolicy.builder()
                    .id("pol-unused")
                    .policyName("Flag Idle Virtual Hardware Nodes")
                    .description("Scans compute node metrics; flags VM instances with CPU usage under 5%.")
                    .policyType(PolicyType.UNUSED_RESOURCE)
                    .enabled(true)
                    .build());

            System.out.println(">>> Compliance policies seeded successfully!");
        }
    }

    private void seedHistoricalCosts() {
        if (costRecordRepository.count() == 0) {
            List<CostRecord> costList = new ArrayList<>();
            LocalDate start = LocalDate.now().minusMonths(6);
            LocalDate end = LocalDate.now();
            Random rand = new Random(42); // fixed seed for reproducible curves

            // Service Names
            String compute = "Compute";
            String database = "Database";
            String storage = "Storage";
            String network = "Network";

            for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                // AWS Costs
                costList.add(CostRecord.builder()
                        .resourceId("res-ec2-prod-01")
                        .provider(Provider.AWS)
                        .serviceName(compute)
                        .region("ap-south-1")
                        .project("Core API Infrastructure")
                        .department("Engineering")
                        .environment("Production")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(150 + rand.nextInt(50)))
                        .currency("INR")
                        .build());

                costList.add(CostRecord.builder()
                        .resourceId("res-rds-prod-02")
                        .provider(Provider.AWS)
                        .serviceName(database)
                        .region("ap-south-1")
                        .project("Core API Infrastructure")
                        .department("Engineering")
                        .environment("Production")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(200 + rand.nextInt(40)))
                        .currency("INR")
                        .build());

                costList.add(CostRecord.builder()
                        .resourceId("res-s3-prod-03")
                        .provider(Provider.AWS)
                        .serviceName(storage)
                        .region("ap-south-1")
                        .project("Core API Infrastructure")
                        .department("Engineering")
                        .environment("Production")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(70 + rand.nextInt(15)))
                        .currency("INR")
                        .build());

                // Azure Costs
                costList.add(CostRecord.builder()
                        .resourceId("res-azure-vm-01")
                        .provider(Provider.AZURE)
                        .serviceName(compute)
                        .region("eastus")
                        .project("Analytics Pipeline")
                        .department("Data Science")
                        .environment("Staging")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(110 + rand.nextInt(30)))
                        .currency("INR")
                        .build());

                costList.add(CostRecord.builder()
                        .resourceId("res-azure-vm-02")
                        .provider(Provider.AZURE)
                        .serviceName(compute)
                        .region("eastus")
                        .project("Analytics Pipeline")
                        .department("Data Science")
                        .environment("Staging")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(140 + rand.nextInt(45)))
                        .currency("INR")
                        .build());

                // GCP Costs
                costList.add(CostRecord.builder()
                        .resourceId("res-gcp-bq-01")
                        .provider(Provider.GCP)
                        .serviceName(database)
                        .region("us-central1")
                        .project("Marketing Portal")
                        .department("Marketing")
                        .environment("Development")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(90 + rand.nextInt(20)))
                        .currency("INR")
                        .build());

                costList.add(CostRecord.builder()
                        .resourceId("res-gcp-gcs-02")
                        .provider(Provider.GCP)
                        .serviceName(storage)
                        .region("us-central1")
                        .project("Marketing Portal")
                        .department("Marketing")
                        .environment("Development")
                        .costDate(date)
                        .amount(BigDecimal.valueOf(25 + rand.nextInt(10)))
                        .currency("INR")
                        .build());
            }

            costRecordRepository.saveAll(costList);
            System.out.println(">>> Seeding: " + costList.size() + " cost history records created!");
        }
    }

    private void seedAlertsAndNotifications() {
        if (alertRepository.count() == 0) {
            alertRepository.save(Alert.builder()
                    .alertType(AlertType.BUDGET)
                    .title("Budget limit breached: Analytics Pipeline")
                    .message("Critical: spent INR 28,000 of allocated limit INR 20,000 (140% consumed)")
                    .severity(RecommendationSeverity.CRITICAL)
                    .isRead(false)
                    .build());

            alertRepository.save(Alert.builder()
                    .alertType(AlertType.GOVERNANCE)
                    .title("Governance policy breach: Public Storage Bucket")
                    .message("Resource S3 Corporate Backups allows anonymous internet access.")
                    .severity(RecommendationSeverity.CRITICAL)
                    .isRead(false)
                    .build());

            alertRepository.save(Alert.builder()
                    .alertType(AlertType.OPTIMIZATION)
                    .title("Right-sizing opportunity discovered")
                    .message("Underutilized VM instance res-ec2-prod-01 (avg CPU 14%) can save up to INR 8,325/mo.")
                    .severity(RecommendationSeverity.HIGH)
                    .isRead(false)
                    .build());
        }

        if (notificationRepository.count() == 0) {
            notificationRepository.save(Notification.builder()
                    .id("n-budget-breach-01")
                    .message("Data Science budget breached! Spend is at 140% of limit.")
                    .type("error")
                    .read(false)
                    .build());

            notificationRepository.save(Notification.builder()
                    .id("n-gov-leak-02")
                    .message("Security Warning: Staging storage buckets are exposed to the public internet!")
                    .type("warning")
                    .read(false)
                    .build());

            notificationRepository.save(Notification.builder()
                    .id("n-sync-success-03")
                    .message("Successfully synced billing CUR metrics from aws-production connection.")
                    .type("success")
                    .read(false)
                    .build());
        }
    }
}
