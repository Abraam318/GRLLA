#!/usr/bin/env python3
"""
NBS Supplements Scraper
Scrapes vitamins and supplements products from nbs-supplements.com
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

class NBSScraper:
    def __init__(self):
        self.base_url = "https://www.nbs-supplements.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
        match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
        return float(match.group()) if match else None
    
    def scrape_product_details(self, product_url):
        """Scrape detailed information from a product page"""
        print(f"Scraping product: {product_url}")
        soup = self.get_page(product_url)
        if not soup:
            return None
        
        product = {
            'url': product_url,
            'name': '',
            'price': None,
            'original_price': None,
            'category': '',
            'categories': [],
            'images': [],
            'description': '',
            'short_description': '',
            'in_stock': True
        }
        
        # Extract product name
        title_elem = soup.find('h1', class_='product_title')
        if title_elem:
            product['name'] = title_elem.get_text(strip=True)
        
        # Extract price
        price_elem = soup.find('p', class_='price')
        if price_elem:
            # Check for sale price
            sale_price = price_elem.find('ins')
            regular_price = price_elem.find('del') or price_elem.find('bdi')
            
            if sale_price:
                product['price'] = self.extract_price(sale_price.get_text())
                if regular_price:
                    product['original_price'] = self.extract_price(regular_price.get_text())
            elif regular_price:
                product['price'] = self.extract_price(regular_price.get_text())
            else:
                product['price'] = self.extract_price(price_elem.get_text())
        
        # Extract images
        image_gallery = soup.find('div', class_='woocommerce-product-gallery')
        if image_gallery:
            images = image_gallery.find_all('img')
            for img in images:
                img_url = img.get('src') or img.get('data-src')
                if img_url and img_url not in product['images']:
                    product['images'].append(img_url)
        
        # Extract categories
        breadcrumb = soup.find('nav', class_='woocommerce-breadcrumb')
        if breadcrumb:
            links = breadcrumb.find_all('a')
            for link in links:
                cat_name = link.get_text(strip=True)
                if cat_name and cat_name.lower() not in ['home', 'shop']:
                    product['categories'].append(cat_name)
                    self.categories.add(cat_name)
        
        # Set main category
        if product['categories']:
            product['category'] = product['categories'][0]
        
        # Extract description
        desc_elem = soup.find('div', class_='woocommerce-product-details__short-description')
        if desc_elem:
            product['short_description'] = desc_elem.get_text(strip=True)
        
        full_desc = soup.find('div', id='tab-description')
        if full_desc:
            product['description'] = full_desc.get_text(strip=True)
        
        # Check stock status
        stock_elem = soup.find('p', class_='stock')
        if stock_elem and 'out of stock' in stock_elem.get_text().lower():
            product['in_stock'] = False
        
        return product
    
    def scrape_shop_page(self, page_num=1):
        """Scrape products from shop listing page"""
        url = f"{self.base_url}/shop/page/{page_num}/" if page_num > 1 else f"{self.base_url}/shop/"
        print(f"\nScraping shop page {page_num}: {url}")
        
        soup = self.get_page(url)
        if not soup:
            return False
        
        # Find all product links
        products_found = 0
        product_items = soup.find_all('li', class_='product')
        
        for item in product_items:
            link_elem = item.find('a', class_='woocommerce-LoopProduct-link')
            if link_elem:
                product_url = link_elem.get('href')
                
                # Check if it's a vitamin/supplement by looking at the product
                product_data = self.scrape_product_details(product_url)
                if product_data:
                    # Filter for vitamins and supplements
                    name_lower = product_data['name'].lower()
                    categories_lower = ' '.join(product_data['categories']).lower()
                    
                    # Keywords that indicate vitamins/supplements
                    supplement_keywords = [
                        'vitamin', 'supplement', 'mineral', 'protein', 'amino', 'bcaa',
                        'creatine', 'collagen', 'omega', 'fish oil', 'multivitamin',
                        'probiotic', 'enzyme', 'antioxidant', 'ginseng', 'extract',
                        'complex', 'support', 'health', 'wellness', 'nutrition',
                        'capsule', 'tablet', 'powder', 'gummies'
                    ]
                    
                    is_supplement = any(keyword in name_lower or keyword in categories_lower 
                                       for keyword in supplement_keywords)
                    
                    if is_supplement:
                        self.products.append(product_data)
                        products_found += 1
                        print(f"  ✓ Added: {product_data['name']}")
                    else:
                        print(f"  ✗ Skipped (not supplement): {product_data['name']}")
                
                # Be nice to the server
                time.sleep(0.5)
        
        print(f"Found {products_found} supplements on page {page_num}")
        
        # Check if there's a next page
        next_page = soup.find('a', class_='next')
        return next_page is not None
    
    def scrape_all(self, max_pages=10):
        """Scrape all products from multiple pages"""
        print("Starting NBS Supplements scraper...")
        print("=" * 60)
        
        page = 1
        while page <= max_pages:
            has_next = self.scrape_shop_page(page)
            if not has_next:
                print(f"\nReached last page at page {page}")
                break
            page += 1
            time.sleep(1)  # Be respectful to the server
        
        print("\n" + "=" * 60)
        print(f"Scraping complete!")
        print(f"Total products scraped: {len(self.products)}")
        print(f"Categories found: {len(self.categories)}")
        print(f"Categories: {', '.join(sorted(self.categories))}")
        
        return self.products
    
    def save_to_json(self, filename='nbs_supplements.json'):
        """Save scraped data to JSON file"""
        data = {
            'products': self.products,
            'categories': sorted(list(self.categories)),
            'total_products': len(self.products),
            'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Data saved to {filename}")
        return filename

def main():
    scraper = NBSScraper()
    
    # Scrape products (limit to 5 pages for now, adjust as needed)
    scraper.scrape_all(max_pages=5)
    
    # Save to JSON
    scraper.save_to_json('nbs_supplements.json')

if __name__ == '__main__':
    main()
