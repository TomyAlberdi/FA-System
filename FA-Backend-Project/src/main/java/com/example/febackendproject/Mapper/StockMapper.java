package com.example.febackendproject.Mapper;

import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Entity.Stock;

public class StockMapper {
    
    public static Stock createNewStock(Product product) {
        Stock stock = new Stock();
        stock.setProductId(product.getId());
        updateStock(stock, product);
        return stock;
    }
    
    public static void updateStock(Stock stock, Product product) {
        stock.setProductName(product.getName());
        stock.setProductImage(product.getImages().isEmpty() ? "" : product.getImages().get(0));
        stock.setProductSaleUnit(product.getSaleUnit());
        stock.setProductMeasureType(product.getMeasureType());
        stock.setProductMeasurePerSaleUnit(product.getMeasurePerSaleUnit());
    }
    
}
