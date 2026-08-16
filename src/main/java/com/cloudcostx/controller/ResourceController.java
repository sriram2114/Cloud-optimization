package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.*;
import com.cloudcostx.repository.CloudResourceRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private CloudResourceRepository resourceRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CloudResource>>> getResources(
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String environment,
            @RequestParam(required = false) String search
    ) {
        Specification<CloudResource> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (provider != null && !provider.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("provider"), Provider.valueOf(provider.toUpperCase())));
            }
            if (type != null && !type.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("resourceType"), ResourceType.valueOf(type.toUpperCase())));
            }
            if (status != null && !status.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("status"), ResourceStatus.valueOf(status.toUpperCase())));
            }
            if (environment != null && !environment.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("environment"), Environment.valueOf(environment.toUpperCase())));
            }
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("resourceName")), pattern),
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.like(cb.lower(root.get("instanceType")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<CloudResource> resources = resourceRepository.findAll(spec);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resource inventory list retrieved successfully"));
    }
}
