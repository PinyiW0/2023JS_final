
import * as c3 from 'c3';
import * as d3 from 'd3';

import axios from "axios";
import { api_path, token } from "./config";

let orderData = [];
const orderList = document.querySelector(".js-orderList");
function init(){
  getOrderList();
  
};
init();
function renderC3() {
  //物件資料搜集
  let total = {};
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if(total[productItem.category] == undefined){
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    })
  });
  //做出資料關聯並整理成C3要求格式
  let categoryAry = Object.keys(total);
  console.log(categoryAry);
  let newData = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  })

  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
      colors: {
        "床架": "#DACBFF",
        "收納": "#9D7FEA",
        "窗簾": "#5434A7",
        "其他": "#301E5F",
      }
    },
  });
}
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
      //組時間字串
      const timeStamp = new Date(item.createdAt*1000);
      const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;
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
        <td>${orderTime}</td>
        <td class="js-orderStatus">
          <a href="#" data-status="${item.paid}" class="orderStatus" data-id = "${item.id}" >${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id = "${item.id}" value="刪除">
        </td>
      </tr>`
    })
    orderList.innerHTML = str;
    renderC3()
  })
  .catch((err) => {
    console.log(err);
  })
};

orderList.addEventListener("click",(e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  let id = e.target.getAttribute("data-id");
  console.log(targetClass);
  //刪除按鈕判斷
  if (targetClass == "delSingleOrder-Btn js-orderDelete"){
    deleteOrderItem(id);
    return;
  };
  //訂單狀態按鈕判斷
  if(targetClass == "orderStatus"){
    changeOrderStatus(status,id)
    return;
  }
});
//修改訂單狀態
function changeOrderStatus(status, id) {
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
  .catch((err) => {
    console.log(err);
  })
}
//刪除購物車指定訂單
function deleteOrderItem(id) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`
  , {
    headers: {
      'Authorization': token,
    }
  })
    .then((res) => {
      alert("刪除該筆訂單成功");
      getOrderList();
    })
    .catch((err) => {
      console.log(err);
    })
};

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`
    , {
      headers: {
        'Authorization': token,
      }
    })
    .then((res) => {
      alert("刪除全部訂單成功");
      getOrderList();
    })
    .catch((err) => {
      console.log(err);
    })
})

