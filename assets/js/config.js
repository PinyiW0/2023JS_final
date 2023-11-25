//產品相關(客戶)
const api_path = "lelejpinyi";
const token = "6qeyUluudZaeYpFMt0AVDthZQGY2";
console.log(api_path, token);

//index 頁面產品清單列表
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
let productData = [];
let str =`<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="https://hexschool-api.s3.us-west-2.amazonaws.com/custom/dp6gW6u5hkUxxCuNi8RjbfgufygamNzdVHWb15lHZTxqZQs0gdDunQBS7F6M3MdegcQmKfLLoxHGgV3kYunUF37DNn6coPH6NqzZwRfhbsmEblpJQLqXLg4yCqUwP3IE.png"
        alt="">
      <a href="#" class="addCardBtn">加入購物車</a>
      <h3>Antony 雙人床架／雙人加大</h3>
      <del class="originPrice">NT$18,000</del>
      <p class="nowPrice">NT$12,000</p>
    </li>`;

const userProductApi = "https://livejs-api.hexschool.io/api/livejs/v1/customer/lelejpinyi/products";
function getProductList() {
  axios.get(userProductApi)
    .then((res) => {
      productData = res.data.products;
      console.log(productData);
      let str = "";
      productData.forEach((item) => {
        str += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="addCardBtn">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`
      })
      productList.innerHTML = str;
    })
    .catch((err) => {
      console.log(err);
    })
};
function init() {
  getProductList();
};
init();