import { api_path, token } from "./config";

//index 頁面產品清單列表
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
let productData = [];

const userProductApi = "https://livejs-api.hexschool.io/api/livejs/v1/customer/lelejpinyi/products";
function getProductList() {
  axios.get(userProductApi)
    .then((res) => {
      productData = res.data.products;
      renderProductList();
      //console.log(productData);
    })
    .catch((err) => {
      console.log(err);
    })
};
function init() {
  getProductList();
};
init();

//下拉選單
productSelect.addEventListener('change', function (e) {
  const category = e.target.value;
  if (category == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == category) {
      str += combineProductHTMLItem(item);
    }
  })
  productList.innerHTML = str;
});

function combineProductHTMLItem(item) {
  return `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="js-addCart" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`
};

function renderProductList() {
  let str = "";
  productData.forEach((item) => {
    str += combineProductHTMLItem(item);
  })
  productList.innerHTML = str;
};

//加入購物車監聽按鈕事件
productList.addEventListener("click",(e) => {
  e.preventDefault();//取消一直從上面更新畫面行為
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart"){
    return;
  }
  let productId = e.target.getAttribute("data-id");
  return console.log(productId);
})
