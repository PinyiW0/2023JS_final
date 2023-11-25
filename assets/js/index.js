const userProductApi = "https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products";
function getProductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
};