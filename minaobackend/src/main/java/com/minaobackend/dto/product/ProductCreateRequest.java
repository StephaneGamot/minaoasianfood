package com.minaobackend.dto.product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductCreateRequest {
    @NotBlank @Size(max=255) private String name;
    @Size(max=2000) private String description;
    @NotNull @DecimalMin(value="0.0", inclusive=false) private BigDecimal price;
    @Size(max=1024) private String imageSrc;
    @Size(max=255)  private String imageAlt;
    @Size(max=500)  private String tags;
    @Size(max=500)  private String searchTag;
    private Boolean active = true;

    // getters/setters
    public String getName(){return name;} public void setName(String v){this.name=v;}
    public String getDescription(){return description;} public void setDescription(String v){this.description=v;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal v){this.price=v;}
    public String getImageSrc(){return imageSrc;} public void setImageSrc(String v){this.imageSrc=v;}
    public String getImageAlt(){return imageAlt;} public void setImageAlt(String v){this.imageAlt=v;}
    public String getTags(){return tags;} public void setTags(String v){this.tags=v;}
    public String getSearchTag(){return searchTag;} public void setSearchTag(String v){this.searchTag=v;}
    public Boolean getActive(){return active;} public void setActive(Boolean v){this.active=v;}
}
