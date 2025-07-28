const products = [
    
    {
      name: "Vivo X200 Pro 5g Mobile",
      image: "pic/vivo.jpeg",
      link:"web21.html"
    },
  
    {
        name: "Apple 16 Pro Max 5g Mobile",
        image: "pic/apple.jpeg",
        link:"web22.html"
    },
    {
        name: "Samsung S24 Ultra 5g Mobile",
        image: "pic/samsung.jpeg",
        link:"web23.html"
    },
    {
      name: "Msi Creator Pro Laptop",
      image: "pic/m1.jpeg",
      link:"web31.html"
  },
  {
    name: "Asus Rog Strix Scar 17 SE Laptop",
    image: "pic/as2.jpeg",
    link:"web32.html"
  },
  {
    name: "Apple MacBook Pro m3 Max Laptop",
    image: "pic/a3.jpeg",
    link:"web33.html"
  },
  {
    name: "Samsung QA98QN990CK 98 inch Neo QLED 8K UHD Tv",
    image: "pic/s1.jpeg",
    link:"web41.html"
  },
  {
    name: "LG OLED97G2PSA 97 inch OLED evo 4K Tv",
    image: "pic/lg1.jpeg",
    link:"web42.html"
  },
  {
    name: "SONY Bravia 210.82 cm OLED 4K Ultra HD Tv",
    image: "pic/so1.jpeg",
    link:"web43.html"
  },
  {
    name: "Sony WI-1000XM2 Neckband",
    image: "pic/son1.jpeg",
    link:"web51.html"
  },
  {
    name: "Denon PerL Pro Earbuds",
    image: "pic/d1.jpeg",
    link:"web52.html"
  },
  {
    name: "Shure SE846 IEM",
    image: "pic/sh1.jpeg",
    link:"web53.html"
  },
  {
    name: "SENNHEISER AMBEO Max Soundbar",
    image: "pic/se1.jpeg",
    link:"web54.html"
  },
  {
    name: "SanDisk Extreme 4TB USB Type-C SSD",
    image: "pic/sa1.jpeg",
    link:"web55.html"
  },
  {
    name: "BANG & OLUFSEN Beoplay H95 Headphone",
    image: "pic/ba1.jpeg",
    link:"web56.html"
  },


  ];
const searchBar = document.getElementById("searchBar");
    const clearBtn = document.getElementById("clearBtn");
    const searchBtn = document.getElementById("searchBtn");
    const productList = document.getElementById("productList");

    function displayProducts(filtered) {
      productList.innerHTML = "";
    
      if (filtered.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
      }
    
      filtered.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
    
        div.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-img" style="cursor:pointer">
          <div>
            <strong>${product.name}</strong><br>
          </div>
        `;
    
        // Navigate to product page on image click
        const img = div.querySelector(".product-img");
        img.addEventListener("click", () => {
          window.location.href = product.link;
        });
    
        productList.appendChild(div);
      });
    }

    function handleSearch() {
      const search = searchBar.value.trim().toLowerCase();

      if (search === "") {
        productList.innerHTML = "<p>Please enter a product name to search.</p>";
        
        return;
      }

      const filtered = products.filter(p => {
        const productName = p.name.toLowerCase();
        return search.split(" ").every(word => productName.includes(word)); 
      });
      
      displayProducts(filtered);
      clearBtn.style.display = "none";
    }

    searchBtn.addEventListener("click", handleSearch);

    searchBar.addEventListener("input", () => {
      clearBtn.style.display =  "block";
    });

    clearBtn.addEventListener("click", () => {
      searchBar.value = "";
      productList.innerHTML = "";
      clearBtn.style.display = "none";
      searchBar.focus();
    });


