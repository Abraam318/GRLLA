#!/usr/bin/env python3
"""
iFit Egypt Fish Oil & Omegas Scraper
Scrapes fish oil products and appends to existing supplements
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re

class IFitFishOilScraper:
    def __init__(self):
        self.base_url = "https://ifit-eg.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        self.products = []
        
    def get_page(self, url):
        """Fetch a page with error handling"""
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_price(self, price_text):
        """Extract numeric price from text"""
        if not price_text:
            return None
        price_text = price_text.replace(',', '').replace('EGP', '').replace('ج.م', '').strip()
        match = re.search(r'[\d.]+', price_text)
        return float(match.group()) if match else None
    
    def scrape_product_details(self, product_url):
        """Scrape detailed information from a product page"""
        print(f"  Scraping: {product_url}")
        soup = self.get_page(product_url)
        if not soup:
            return None
        
        product = {
            'url': product_url,
            'name': '',
            'price': None,
            'original_price': None,
            'category': 'Fish Oil & Omegas',
            'categories': ['Fish Oil & Omegas'],
            'images': [],
            'description': '',
            'short_description': '',
            'in_stock': True
        }
        
        # Extract product name
        title_elem = soup.find('h1', class_='product_title')
        if not title_elem:
            title_elem = soup.find('h1')
        if title_elem:
            product['name'] = title_elem.get_text(strip=True)
        
        # Extract price
        price_elem = soup.find('p', class_='price')
        if not price_elem:
            price_elem = soup.find('span', class_='woocommerce-Price-amount')
        
        if price_elem:
            sale_price = price_elem.find('ins')
            regular_price = price_elem.find('del')
            
            if sale_price:
                product['price'] = self.extract_price(sale_price.get_text())
                if regular_price:
                    product['original_price'] = self.extract_price(regular_price.get_text())
            else:
                price_spans = price_elem.find_all('span', class_='woocommerce-Price-amount')
                if price_spans:
                    product['price'] = self.extract_price(price_spans[-1].get_text())
                else:
                    product['price'] = self.extract_price(price_elem.get_text())
        
        # Extract images
        images_found = []
        
        gallery = soup.find('div', class_='woocommerce-product-gallery')
        if gallery:
            imgs = gallery.find_all('img')
            for img in imgs:
                img_url = img.get('src') or img.get('data-src') or img.get('data-large_image')
                if img_url and img_url.startswith('http'):
                    images_found.append(img_url)
        
        featured_img = soup.find('img', class_='wp-post-image')
        if featured_img:
            img_url = featured_img.get('src') or featured_img.get('data-src')
            if img_url and img_url.startswith('http'):
                images_found.append(img_url)
        
        product['images'] = list(dict.fromkeys(images_found))
        
        # Extract descriptions
        short_desc = soup.find('div', class_='woocommerce-product-details__short-description')
        if short_desc:
            product['short_description'] = short_desc.get_text(strip=True)[:200]
        
        full_desc = soup.find('div', id='tab-description')
        if not full_desc:
            full_desc = soup.find('div', class_='woocommerce-Tabs-panel--description')
        if full_desc:
            desc_text = full_desc.get_text(strip=True)
            product['description'] = desc_text[:1000] if len(desc_text) > 1000 else desc_text
        
        if not product['description'] and product['short_description']:
            product['description'] = product['short_description']
        
        # Check stock status
        stock_elem = soup.find('p', class_='stock')
        if stock_elem and 'out of stock' in stock_elem.get_text().lower():
            product['in_stock'] = False
        
        return product
    
    def scrape_category_page(self, page_num=1):
        """Scrape products from category page"""
        if page_num == 1:
            url = "https://ifit-eg.com/product-category/fish-oil-omegas/"
        else:
            url = f"https://ifit-eg.com/product-category/fish-oil-omegas/page/{page_num}/"
        
        print(f"\n{'='*60}")
        print(f"Scraping page {page_num}: {url}")
        print('='*60)
        
        soup = self.get_page(url)
        if not soup:
            return False
        
        products_found = 0
        product_items = soup.find_all('li', class_='product')
        if not product_items:
            product_items = soup.find_all('div', class_='product')
        
        print(f"Found {len(product_items)} product items on page")
        
        for item in product_items:
            link_elem = item.find('a', class_='woocommerce-LoopProduct-link')
            if not link_elem:
                link_elem = item.find('a', href=True)
            
            if link_elem:
                product_url = link_elem.get('href')
                product_data = self.scrape_product_details(product_url)
                
                if product_data and product_data['name']:
                    self.products.append(product_data)
                    products_found += 1
                    print(f"  ✓ Added: {product_data['name']} ({len(product_data['images'])} images)")
                
                time.sleep(1)
        
        print(f"\nPage {page_num} complete: {products_found} products added")
        
        next_page = soup.find('a', class_='next')
        return next_page is not None
    
    def scrape_all(self, max_pages=10):
        """Scrape all products from multiple pages"""
        print("\n" + "="*60)
        print("Starting iFit Egypt Fish Oil & Omegas Scraper")
        print("="*60)
        
        page = 1
        while page <= max_pages:
            has_next = self.scrape_category_page(page)
            if not has_next:
                print(f"\nNo more pages found after page {page}")
                break
            page += 1
            if page <= max_pages:
                time.sleep(2)
        
        print("\n" + "="*60)
        print("Scraping Complete!")
        print("="*60)
        print(f"Total products scraped: {len(self.products)}")
        print(f"Products with images: {sum(1 for p in self.products if p['images'])}")
        
        return self.products
    
    def append_to_existing(self, existing_file='nbs_supplements.json', output_file='nbs_supplements.json'):
        """Append scraped products to existing supplements file"""
        try:
            with open(existing_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            
            # Append new products
            existing_data['products'].extend(self.products)
            existing_data['total_products'] = len(existing_data['products'])
            
            # Save updated data
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, indent=2, ensure_ascii=False)
            
            print(f"\n✓ Appended {len(self.products)} products to {output_file}")
            print(f"✓ Total products now: {existing_data['total_products']}")
            
        except Exception as e:
            print(f"Error appending to file: {e}")

def main():
    scraper = IFitFishOilScraper()
    scraper.scrape_all(max_pages=10)
    scraper.append_to_existing()
    
    print("\n" + "="*60)
    print("Summary:")
    print("="*60)
    for i, product in enumerate(scraper.products[:5], 1):
        print(f"{i}. {product['name']}")
        print(f"   Price: {product['price']} EGP")
        print(f"   Images: {len(product['images'])}")
        print()

if __name__ == '__main__':
    main()
