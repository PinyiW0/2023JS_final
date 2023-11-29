import axios from "axios";
import { api_path, token } from "./config";
import { toThousands } from "./utils";

//index 頁面產品清單列表
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.shoppingCart-tableList');
let productData = [];
let cartData = [];

const userProductApi = "https://livejs-api.hexschool.io/api/livejs/v1/customer/lelejpinyi/products";
const cartListAPI = "https://livejs-api.hexschool.io/api/livejs/v1/customer/lelejpinyi/carts";

function init() {
  getProductList();
  getCartList();
};
init();

function getProductList() {
  axios.get(userProductApi)
    .then((res) => {
      productData = res.data.products;
      renderProductList();
    })
    .catch((err) => {
      console.log(err);
    })
};

function combineProductHTMLItem(item) {
  return `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="js-addCart" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
      <p class="nowPrice">NT$${toThousands(item.price)}</p>
    </li>`
};
//渲染產品列表
function renderProductList() {
  let str = "";
  productData.forEach((item) => {
    str += combineProductHTMLItem(item);
  })
  productList.innerHTML = str;
};

//下拉選單
productSelect.addEventListener("change", (e) => {
  const category = e.target.value;
  if (category == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach((item) => {
    if (item.category == category) {
      str += combineProductHTMLItem(item);
    }
  })
  productList.innerHTML = str;
});


//加入購物車監聽按鈕事件
productList.addEventListener("click", (e) => {
  e.preventDefault();//取消一直從上面更新畫面行為
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  let numCheck = 1;
  //加入購物車邏輯
  cartData.forEach((item) => {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  })
  axios.post(cartListAPI, {
    "data": {
      "productId": productId,
      "quantity": numCheck
    }
  })
    .then((res) => {
      alert("加入購物車");
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    })
});


//取得購物車列表

function getCartList() {
  axios.get(cartListAPI)
    .then((res) => {
      document.querySelector(".js-total").textContent = toThousands(res.data.finalTotal) ; //計算總金額
      cartData = res.data.carts;
      let str = "";
      cartData.forEach((item) => {
        str += `<tr>
          <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="">
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${toThousands(item.product.price)}</td>
          <td>${item.quantity}</td>
          <td>NT$${toThousands(item.product.price * item.quantity)}</td>
          <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
              clear
            </a>
          </td>
        </tr>`
      });

      cartList.innerHTML = str;
    })
    .catch((err) => {
      console.log(err);
    })
};

//刪除單筆購物車
cartList.addEventListener('click', (e) => {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  if(cartId == null){
    alert("你點到其他東西了")
    return;
  } 
  console.log(cartId);
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
  .then((res) => {
    alert("刪除成功！(๑´ㅂ`๑)");
    getCartList();
  })
  .catch(function (response) {
    alert("沒有刪除成功(◔⊖◔)つ")
  })
});
//刪除全部購物車

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then((res) => {
    alert("全部刪除成功，真的全部都不要了嗎？(╥﹏╥)");
    getCartList();
  })
  .catch((res) => {
    alert("購物車已經清空，請勿重複點擊")
  })
});

//送出訂單
// const orderInfoBtn = document.querySelector(".orderInfo-btn");
// orderInfoBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   if(cartData.length == 0){
//     alert("請加入購物車");
//     return;
//   }
//   const customerName = document.querySelector("#customerName").value;
//   const customerPhone = document.querySelector("#customerPhone").value;
//   const customerEmail = document.querySelector("#customerEmail").value;
//   const customerAddress = document.querySelector("#customerAddress").value;
//   const customerTradeWay = document.querySelector("#tradeWay").value;
//   if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || customerTradeWay == "") {
//     alert("請輸入訂單資訊");
//     return;
//   }
//   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
//     "data": {
//       "user": {
//         "name": customerName,
//         "tel": customerPhone,
//         "email": customerEmail,
//         "address": customerAddress,
//         "payment": customerTradeWay
//       }
//     }
//   }).then((res) => {
//     alert("訂單建立成功");
//     document.querySelector("#customerName").value = "";
//     document.querySelector("#customerPhone").value = "";
//     document.querySelector("#customerEmail").value = "";
//     document.querySelector("#customerAddress").value = "";
//     document.querySelector("#tradeWay").value = "ATM";
//     getCartList();
//   }).catch((err) => {
//     console.log(err);
//   });
// })

//送出訂單優化
const orderInfoBtn = document.querySelector(".orderInfo-btn");

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const customerNameInput = document.querySelector("#customerName");
  const customerPhoneInput = document.querySelector("#customerPhone");
  const customerEmailInput = document.querySelector("#customerEmail");
  const customerAddressInput = document.querySelector("#customerAddress");
  const customerTradeWayInput = document.querySelector("#tradeWay");

  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }
  const inputs =[
    customerNameInput,
    customerPhoneInput,
    customerEmailInput,
    customerAddressInput,
    customerTradeWayInput
  ];
  const isEmpty = inputs.some((input) => input.value === "");
  if (isEmpty){
    alert("請輸入訂單資訊");
    return;
  };

  axios
  .post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
    "data": {
      "user": {
        "name": customerNameInput.value,
        "tel": customerPhoneInput.value,
        "email": customerEmailInput.value,
        "address": customerAddressInput.value,
        "payment": customerTradeWayInput.value,
      }
    }
  })
  .then((res) => {
    alert("訂單建立成功");
    clearInputs(inputs);
    getCartList();
  })
  .catch((err) => {
    console.log(err);
  });
});

function clearInputs(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
};