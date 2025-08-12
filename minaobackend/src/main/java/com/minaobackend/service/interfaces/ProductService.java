package com.minaobackend.service.interfaces;

import com.minaobackend.dto.product.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductResponse> search(String q, String tag, Pageable pageable);
    ProductResponse get(Long id);
    ProductResponse create(ProductCreateRequest req);
    ProductResponse update(Long id, ProductUpdateRequest req);
    void delete(Long id);

}
