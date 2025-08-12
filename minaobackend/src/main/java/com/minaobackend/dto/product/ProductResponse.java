package com.minaobackend.dto.product;

import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageSrc;
    private String imageAlt;
    private String tags;
    private String searchTag;
    private boolean active;

    // getters/setters
    public Long getId(){return id;} public void setId(Long v){this.id=v;}
    public String getName(){return name;} public void setName(String v){this.name=v;}
    public String getDescription(){return description;} public void setDescription(String v){this.description=v;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal v){this.price=v;}
    public String getImageSrc(){return imageSrc;} public void setImageSrc(String v){this.imageSrc=v;}
    public String getImageAlt(){return imageAlt;} public void setImageAlt(String v){this.imageAlt=v;}
    public String getTags(){return tags;} public void setTags(String v){this.tags=v;}
    public String getSearchTag(){return searchTag;} public void setSearchTag(String v){this.searchTag=v;}
    public boolean isActive(){return active;} public void setActive(boolean v){this.active=v;}
}
