
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
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
      'Authorization':token,
    }
  })
  .then((res) => {
     orderData = res.data.orders;
     let str ='';
    str += `<tr>
          <td>10088377474</td>
          <td>
            <p>小杰</p>
            <p>0912345678</p>
          </td>
          <td>高雄市前鎮區六合路183巷66號</td>
          <td>cccexample@gmail.com</td>
          <td>
            <p>Louvre 雙人床架</p>
          </td>
          <td>2021/03/08</td>
          <td class="orderStatus">
            <a href="#">未處理</a>
          </td>
          <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除">
          </td>
        </tr>`
  })
}

