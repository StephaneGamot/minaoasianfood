// src/main/java/com/minaobackend/entity/ProductCategory.java
package com.minaobackend.entity;

public enum ProductCategory {
    STARTERS("entrees","/menu#entrees"),
    NOODLES("nouilles","/menu/#nouilles"),
    RICE("riz","/menu#riz"),
    PAD_THAI("pad-thai","/menu#pad-thai"),
    SAUCE_PLATS("plats-sauce","/menu#plats-sauce"),
    BAOS("baos","/menu#baos"),
    DESSERTS("desserts","/menu#desserts"),
    BOISSONS("boissons","/menu#boissons");

    public final String slug;
    public final String href;
    ProductCategory(String slug, String href){ this.slug=slug; this.href=href; }
}
