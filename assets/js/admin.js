
import * as c3 from 'c3';
import * as d3 from 'd3';
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      "其他": "#301E5F",
    }
  },
});

import axios from "axios";
import { api_path, token } from "./config";

let orderData = [];
const orderList = document.querySelector(".js-orderList");
function init(){
  getOrderList();
};
init();
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
      'Authorization':token,
    }
  })
  .then((res) => {
    console.log(res.data)
    orderData = res.data.orders;
    console.log(orderData);
    let str ='';
    orderData.forEach((item) => {
      //組產品字串
      let productStr = "";
      item.products.forEach((productItem) => {
        productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
      })
      //判斷訂單處理狀態
      let orderStatus = "";
      orderStatus = item.paid ? "已處理" : "未處理";
      //組訂單字串
      str += `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${item.createdAt}</td>
        <td class="js-orderStatus">
          <a href="#" data-status="${item.paid}" class="orderStatus" data-id = "${item.id}" >${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id = "${item.id}" value="刪除">
        </td>
      </tr>`
    })
    orderList.innerHTML = str;
  })
};

orderList.addEventListener("click",(e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  console.log(targetClass);
  //刪除按鈕判斷
  if (targetClass == "delSingleOrder-Btn js-orderDelete"){
    alert("你點擊到刪除按鈕了");
    return;
  };
  //訂單狀態按鈕判斷
  if(targetClass == "orderStatus"){
    let id = e.target.getAttribute("data-id");
    deleteOrderItem(status,id)
    return;
  }
});

function deleteOrderItem(status, id) {
  let newStatus;
  newStatus = status === true ? false : true; //newStatus = !status;
  
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    "data": {
      "id": id,
      "paid": newStatus
    }
  } ,{
    headers: {
      'Authorization': token,
    }
  })
  .then((res) => {
    alert("修改成功");
    getOrderList();
  })
}

