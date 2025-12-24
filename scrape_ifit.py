#!/usr/bin/env python3
"""
iFit Egypt Best Sellers Scraper (English Version)
Scrapes best seller supplements from ifit-eg.com with images
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

class IFitScraper:
    def __init__(self):
        self.base_url = "https://ifit-eg.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        self.products = []
        self.categories = set()
        
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
        # Remove currency symbols and extract number
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
            'category': 'Best Sellers',
            'categories': ['Best Sellers', 'Sport Supplement'],
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
            # Check for sale price
            sale_price = price_elem.find('ins')
            regular_price = price_elem.find('del')
            
            if sale_price:
                product['price'] = self.extract_price(sale_price.get_text())
                if regular_price:
                    product['original_price'] = self.extract_price(regular_price.get_text())
            else:
                # Try to find any price
                price_spans = price_elem.find_all('span', class_='woocommerce-Price-amount')
                if price_spans:
                    product['price'] = self.extract_price(price_spans[-1].get_text())
                else:
                    product['price'] = self.extract_price(price_elem.get_text())
        
        # Extract images - multiple methods
        images_found = []
        
        # Method 1: Product gallery
        gallery = soup.find('div', class_='woocommerce-product-gallery')
        if gallery:
            imgs = gallery.find_all('img')
            for img in imgs:
                img_url = img.get('src') or img.get('data-src') or img.get('data-large_image')
                if img_url and img_url.startswith('http'):
                    images_found.append(img_url)
        
        # Method 2: Featured image
        featured_img = soup.find('img', class_='wp-post-image')
        if featured_img:
            img_url = featured_img.get('src') or featured_img.get('data-src')
            if img_url and img_url.startswith('http'):
                images_found.append(img_url)
        
        # Method 3: Any product images
        product_images = soup.find_all('img', class_='attachment-shop_single')
        for img in product_images:
            img_url = img.get('src') or img.get('data-src')
            if img_url and img_url.startswith('http'):
                images_found.append(img_url)
        
        # Remove duplicates and add to product
        product['images'] = list(dict.fromkeys(images_found))
        
        # Extract short description
        short_desc = soup.find('div', class_='woocommerce-product-details__short-description')
        if short_desc:
            product['short_description'] = short_desc.get_text(strip=True)[:200]
        
        # Extract full description
        desc_tab = soup.find('div', id='tab-description')
        if not desc_tab:
            desc_tab = soup.find('div', class_='woocommerce-Tabs-panel--description')
        if desc_tab:
            # Get text but limit length
            desc_text = desc_tab.get_text(strip=True)
            product['description'] = desc_text[:1000] if len(desc_text) > 1000 else desc_text
        
        # If no description, use short description
        if not product['description'] and product['short_description']:
            product['description'] = product['short_description']
        
        # Check stock status
        stock_elem = soup.find('p', class_='stock')
        if stock_elem:
            stock_text = stock_elem.get_text().lower()
            if 'out of stock' in stock_text or 'نفذ من المخزون' in stock_text:
                product['in_stock'] = False
        
        return product
    
    def scrape_category_page(self, page_num=1):
        """Scrape products from category page"""
        if page_num == 1:
            url = "https://ifit-eg.com/product-category/best-sellers-sport-supplement/"
        else:
            url = f"https://ifit-eg.com/product-category/best-sellers-sport-supplement/page/{page_num}/"
        
        print(f"\n{'='*60}")
        print(f"Scraping page {page_num}: {url}")
        print('='*60)
        
        soup = self.get_page(url)
        if not soup:
            return False
        
        # Find all product links
        products_found = 0
        
        # Try different selectors for product items
        product_items = soup.find_all('li', class_='product')
        if not product_items:
            product_items = soup.find_all('div', class_='product')
        
        print(f"Found {len(product_items)} product items on page")
        
        for item in product_items:
            # Find product link
            link_elem = item.find('a', class_='woocommerce-LoopProduct-link')
            if not link_elem:
                link_elem = item.find('a', href=True)
            
            if link_elem:
                product_url = link_elem.get('href')
                
                # Scrape product details
                product_data = self.scrape_product_details(product_url)
                
                if product_data and product_data['name']:
                    self.products.append(product_data)
                    products_found += 1
                    print(f"  ✓ Added: {product_data['name']} ({len(product_data['images'])} images)")
                else:
                    print(f"  ✗ Skipped: Could not extract product data")
                
                # Be nice to the server
                time.sleep(1)
        
        print(f"\nPage {page_num} complete: {products_found} products added")
        
        # Check if there's a next page
        next_page = soup.find('a', class_='next')
        return next_page is not None
    
    def scrape_all(self, max_pages=10):
        """Scrape all products from multiple pages"""
        print("\n" + "="*60)
        print("Starting iFit Egypt Best Sellers Scraper (English)")
        print("="*60)
        
        page = 1
        while page <= max_pages:
            has_next = self.scrape_category_page(page)
            if not has_next:
                print(f"\nNo more pages found after page {page}")
                break
            page += 1
            if page <= max_pages:
                time.sleep(2)  # Be respectful to the server
        
        print("\n" + "="*60)
        print("Scraping Complete!")
        print("="*60)
        print(f"Total products scraped: {len(self.products)}")
        print(f"Products with images: {sum(1 for p in self.products if p['images'])}")
        print(f"Average images per product: {sum(len(p['images']) for p in self.products) / len(self.products) if self.products else 0:.1f}")
        
        return self.products
    
    def save_to_json(self, filename='ifit_supplements.json'):
        """Save scraped data to JSON file"""
        data = {
            'products': self.products,
            'categories': sorted(list(self.categories)),
            'total_products': len(self.products),
            'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'source': 'iFit Egypt - Best Sellers (English)'
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Data saved to {filename}")
        return filename

def main():
    scraper = IFitScraper()
    
    # Scrape all pages
    scraper.scrape_all(max_pages=10)
    
    # Save to JSON
    scraper.save_to_json('ifit_supplements.json')
    
    # Print summary
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
