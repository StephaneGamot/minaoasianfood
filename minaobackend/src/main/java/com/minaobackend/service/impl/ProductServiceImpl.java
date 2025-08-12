// src/main/java/com/minaobackend/service/impl/ProductServiceImpl.java
package com.minaobackend.service.impl;

import com.minaobackend.dto.product.ProductCreateRequest;
import com.minaobackend.dto.product.ProductResponse;
import com.minaobackend.dto.product.ProductUpdateRequest;
import com.minaobackend.entity.Product;
import com.minaobackend.repository.ProductRepository;
import com.minaobackend.service.interfaces.ProductService;
import com.minaobackend.exception.BadRequestException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    public ProductServiceImpl(ProductRepository repo) {
        this.repo = repo;
    }

    // ======= SEARCH (filtre + tri + pagination en mémoire) =======
    @Override
    public Page<ProductResponse> search(String q, String tag, Pageable pageable) {
        List<Product> data = repo.findByActiveTrue();

        // filtre texte (name + searchTag)
        if (!isNullOrBlank(q)) {
            final String qq = q.toLowerCase();
            data = data.stream()
                    .filter(p ->
                            (p.getName() != null && p.getName().toLowerCase().contains(qq)) ||
                                    (p.getSearchTag() != null && p.getSearchTag().stream()
                                            .anyMatch(t -> t != null && t.toLowerCase().contains(qq)))
                    )
                    .collect(Collectors.toList());
        }

        // filtre par tag exact (dans la liste tags)
        if (!isNullOrBlank(tag)) {
            final String tt = tag.toLowerCase();
            data = data.stream()
                    .filter(p -> p.getTags() != null && p.getTags().stream()
                            .anyMatch(t -> t != null && t.equalsIgnoreCase(tt)))
                    .collect(Collectors.toList());
        }

        // tri
        Comparator<Product> comp = comparatorFrom(pageable.getSort());
        Collections.sort(data, comp);

        // pagination en mémoire
        int total = data.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        List<Product> slice = (start >= end) ? Collections.emptyList() : data.subList(start, end);

        // mapping DTO
        List<ProductResponse> content = slice.stream()
                .map(ProductMapper::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, total);
    }

    // ======= GET =======
    @Override
    public ProductResponse get(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new BadRequestException("Product not found: id=" + id));
        return ProductMapper.toResponse(p);
    }

    // ======= CREATE =======
    @Override
    public ProductResponse create(ProductCreateRequest req) {
        Product p = new Product();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setImageSrc(req.getImageSrc());
        p.setImageAlt(req.getImageAlt());
        p.setActive(req.getActive() == null ? true : req.getActive().booleanValue());

        // si ton Product a List<String> tags/searchTag :
        p.setTags(parseCsvList(req.getTags()));
        p.setSearchTag(parseCsvList(req.getSearchTag()));

        Product saved = repo.save(p);
        return ProductMapper.toResponse(saved);
    }

    // ======= UPDATE =======
    @Override
    public ProductResponse update(Long id, ProductUpdateRequest req) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new BadRequestException("Product not found: id=" + id));

        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setImageSrc(req.getImageSrc());
        p.setImageAlt(req.getImageAlt());
        p.setActive(req.getActive() != null && req.getActive().booleanValue());

        p.setTags(parseCsvList(req.getTags()));
        p.setSearchTag(parseCsvList(req.getSearchTag()));

        Product saved = repo.save(p);
        return ProductMapper.toResponse(saved);
    }

    // ======= DELETE =======
    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new BadRequestException("Product not found: id=" + id);
        }
        repo.deleteById(id);
    }

    // ======= helpers =======
    private static boolean isNullOrBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static List<String> parseCsvList(String csv) {
        if (csv == null || csv.trim().isEmpty()) return Collections.emptyList();
        String[] parts = csv.split(",");
        List<String> out = new ArrayList<String>(parts.length);
        for (String part : parts) {
            String v = part == null ? null : part.trim();
            if (v != null && !v.isEmpty()) out.add(v);
        }
        return out;
    }

    private static Comparator<Product> comparatorFrom(Sort sort) {
        // défaut: name ASC
        Comparator<Product> comp = byNameAsc();
        if (sort == null || !sort.isSorted()) return comp;

        Sort.Order first = sort.iterator().next();
        String prop = first.getProperty();
        boolean desc = first.getDirection() == Sort.Direction.DESC;

        if ("price".equalsIgnoreCase(prop)) comp = byPriceAsc();
        else if ("id".equalsIgnoreCase(prop)) comp = byIdAsc();
        else comp = byNameAsc();

        return desc ? comp.reversed() : comp;
    }

    private static Comparator<Product> byNameAsc() {
        return new Comparator<Product>() {
            @Override public int compare(Product a, Product b) {
                String na = a == null ? null : a.getName();
                String nb = b == null ? null : b.getName();
                if (na == null && nb == null) return 0;
                if (na == null) return 1;
                if (nb == null) return -1;
                return String.CASE_INSENSITIVE_ORDER.compare(na, nb);
            }
        };
    }

    private static Comparator<Product> byPriceAsc() {
        return new Comparator<Product>() {
            @Override public int compare(Product a, Product b) {
                if (a == null && b == null) return 0;
                if (a == null) return 1;
                if (b == null) return -1;
                if (a.getPrice() == null && b.getPrice() == null) return 0;
                if (a.getPrice() == null) return 1;
                if (b.getPrice() == null) return -1;
                return a.getPrice().compareTo(b.getPrice());
            }
        };
    }

    private static Comparator<Product> byIdAsc() {
        return new Comparator<Product>() {
            @Override public int compare(Product a, Product b) {
                Long ia = a == null ? null : a.getId();
                Long ib = b == null ? null : b.getId();
                if (ia == null && ib == null) return 0;
                if (ia == null) return 1;
                if (ib == null) return -1;
                return ia.compareTo(ib);
            }
        };
    }
}
