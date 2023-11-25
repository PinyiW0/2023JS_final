//產品相關(客戶)
const api_path = "lelejpinyi";
const token = "6qeyUluudZaeYpFMt0AVDthZQGY2";

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
productSelect.addEventListener('change',function(e){
  const category = e.target.value;
  if (category == "全部"){
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (category == category) {
      str += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`
    }
  })
  productList.innerHTML = str;
});

function renderProductList() {
  let str = "";
  productData.forEach((item) => {
    str += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`
  })
  productList.innerHTML = str;
}