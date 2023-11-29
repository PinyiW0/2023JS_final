
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

function renderC3_lv2(){
  //資料蒐集
  let obj = {};
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if(obj[productItem.title] === undefined){
        obj[productItem.title] = productItem.quantity * productItem.price;
      } else {
        obj[productItem.title] += productItem.quantity * productItem.price;
      }
    })
  })

//資料關聯
let originAry = Object.keys(obj);

let rankSortAry = [];
//將訂單名稱和其金額push到rankSortAry
originAry.forEach((item) => {
  let ary = [];
  ary.push(item);
  ary.push(obj[item]);
  rankSortAry.push(ary);
});
  //進行排序
  rankSortAry.sort((a, b) => {
    return b[1] - a[1];
  });

  if(rankSortAry.length > 3){
    let otherTotal = 0;
    rankSortAry.forEach((item, index) => {
      if (index > 2) { //從第三筆資料之後做加總
        otherTotal += rankSortAry[index][1]
      }
    })
    //刪除第三筆之後的資料
    rankSortAry.splice(3, rankSortAry.length - 1);
    //寫入其他的資料
    rankSortAry.push(['其他', otherTotal]);
  }

  c3.generate({
    bindto: '#chart',
    data: {
      columns: rankSortAry,
      type: 'pie',
    },
    color: {
      pattern: ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
    }
  });
};

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
    renderC3_lv2();
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
});



