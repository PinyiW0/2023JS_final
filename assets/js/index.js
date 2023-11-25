const userProductApi = "https://livejs-api.hexschool.io/api/livejs/v1/customer/lelejpinyi/products";
function getProductList() {
  axios.get(userProductApi)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
};