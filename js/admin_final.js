
function loadTable(index){
    var s=`<table id="itemTable">
                <thead>
                    <tr>  
                        <th>ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Cost</th>   
                        <th>Thao tác</th>
                    </tr>
                </thead><tbody id="itemTableBody">`;
    for(var i=0; i<index.length;i++){
        s+=`    
        <tr>
            <th>${index[i].productId}</th>
            <th>${index[i].nameP}</th>
            <th><img src="../img/${index[i].img}" alt="a"></th>
            <th>${index[i].category}</th>
            <th>${index[i].price + '$'}</th>
            <th>
                <button id="${index[i].productId}">Sửa</button>
                <button id="${index[i].productId}"> Xóa</button> 
            </th>
        </tr>`;
    }
    s+= `</tbody></table>`;
    document.getElementById('productList').innerHTML = s;
}


function exitWebsite() {
    // Chuyển hướng người dùng đến một trang khác hoặc trang chính
    window.location.href = '../index.html';
}

// --------------Thêm sản phẩm ------------


var clickLi = document.querySelector('.selected-page');
  



window.onload = function(){
    

    var existingProducts = JSON.parse(localStorage.getItem('product')) || [];

    var addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn form tự động gửi dữ liệu và làm tải lại trang
        // Kiểm tra xem phần tử submit có id là 'add-submit' hay không
        if (event.submitter && event.submitter.id === 'add-submit') {
            var productId = document.getElementById('productId').value;
            var productName = document.getElementById('productName').value;
            var productImg = document.getElementById('productImg').files[0];
            var productCost = document.getElementById('productCost').value;
                
            var productCate = document.getElementById('productCate').value;

            
            console.log(productImg.name);
    
            var newProduct = {
                category : productCate,
                productId: productId,
                nameP: productName,
                img: productImg.name,
                price: productCost + "",
            };
           
            if (existIdProduct(productId)) {
                if (isNaN(productCost)) {
                    alert("Vui lòng nhập lại giá của sản phẩm là số.");
                    }
                else {
                existingProducts.push(newProduct);
                localStorage.setItem('product', JSON.stringify(existingProducts));
                renderPageNumber();
                clearValueProduct();
                alert('Sản phẩm đã được thêm thành công!');}
            } else {
                alert('Id không được trùng!');
            }
        }
    });
    
    function existIdProduct(productId) {
        // existingProducts = JSON.parse(localStorage.getItem('product')) || [];
    
        for (let i = 0; i < existingProducts.length; i++) {
            if (existingProducts[i].id === productId) {
                return false;
            }
        }
        return true;
    }
    
    // -------------------Xóa sản phẩm--------------------

    function deleteProduct(productId) {
        var confirmation = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    
        if (confirmation) {
            var index = existingProducts.findIndex(function (product) {
                return product.productId == productId;
            });
    
            if (index !== -1) {
                existingProducts.splice(index, 1);
                localStorage.setItem('product', JSON.stringify(existingProducts));
                 // Tự động nhấn vào phần tử li tương ứng
                var pageNumberToClick = currentPage; // Thay đổi giá trị nếu cần thiết
                var liToClick = document.querySelector(`#pagination li:nth-child(${pageNumberToClick})`);
                if (liToClick) {
                    liToClick.click();
                }
                renderPageNumber();
            } else {
                alert('Không tìm thấy sản phẩm để xóa!');
            }
        } else {
            alert('Xóa sản phẩm đã bị hủy.');
        }
    }
    document.getElementById('productList').addEventListener('click', function (event) {
        var target = event.target;
    
        if (target.tagName === 'BUTTON' && target.textContent.trim() === 'Xóa') {
            var productId = target.id; // Lấy productId từ id của nút "Xóa"
            deleteProduct(productId);
        }
    });





    // ý tưởng : truyền vào tham số cho loadTable

    //------------- Phân trang -------------------

    var perPage = 6;
    var perexProduct = [];  

    function getExProduct() {
        try {
            perexProduct = existingProducts.slice(
                (currentPage - 1) * perPage,
                (currentPage - 1) * perPage + perPage
            );
            loadTable(perexProduct);
        } catch (e) {
            console.log(e);
        }
    }
    function handPageNumber(num) {
        existingProducts = JSON.parse(localStorage.getItem('product')) || [];
        currentPage = num;
        getExProduct();
    }

    function renderPageNumber() {
        existingProducts = JSON.parse(localStorage.getItem('product')) || [];
        totalPage = Math.ceil(existingProducts.length / perPage);
        let paginationContainer = document.querySelector('#pagination');
    
        paginationContainer.innerHTML = '';
    
        for (let i = 1; i <= totalPage; i++) {
            let li = document.createElement('li');
            li.textContent = i;
            if (i === 1) {
                li.classList.add('selected-page');
            }
    
            li.addEventListener('click', function () {
                document.querySelectorAll('#pagination li').forEach(function (el) {
                    el.classList.remove('selected-page');
                });
    
                li.classList.add('selected-page');
                handPageNumber(i);
            });
    
            paginationContainer.appendChild(li);
        }
    }
    renderPageNumber();
    currentPage = 1;
    getExProduct(); 

    

}


function clearValueProduct(){
    document.getElementById('oldImg').src ='';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productImg').value = '';
    document.getElementById('productCost').value = '';
    document.getElementById('productCate').value = '';
}


//-------------------- sửa dữ liệu --------------------------------

    // ý tưởng : tạo một div chứa ảnh cũ và ảnh mới thì chọn như bth
    
    
    document.getElementById('productList').addEventListener('click', function (event) {
        var target = event.target;
    
        if (target.tagName === 'BUTTON' && target.textContent.trim() === 'Sửa') {
            var productId = target.id;
            editProduct(productId);
        }
    });
    
    function editProduct(productId) {
        var existingProducts = JSON.parse(localStorage.getItem('product')) || [];
        var index = existingProducts.findIndex(function (product) {
            return product.productId == productId;
        });
        var productImg = existingProducts[index].img;
        var oldImg = document.getElementById('oldImg');
        console.log(productImg);
        oldImg.src = '../img/' + productImg;
        document.getElementById('index').value =index;
        document.getElementById('productCate').value = existingProducts[index].category;
        document.getElementById('productId').value = existingProducts[index].productId;
        document.getElementById('productName').value = existingProducts[index].nameP;
        document.getElementById('productCost').value = existingProducts[index].price;
        document.getElementById('addProduct').style.display = "block";
        document.getElementById('h2-add').style.display = "none";
        document.getElementById('h2-cha').style.display = "block";
        document.getElementById('add-submit').style.display = "none";
        document.getElementById('add-update').style.display = "block";
        document.getElementById('oldImgs').style.display= 'block';

    }

    

    function changeProduct() {
        var existingProducts = JSON.parse(localStorage.getItem('product')) || [];
        var index = document.getElementById('index').value;
        var productCate = document.getElementById('productCate').value;
        var productId = document.getElementById('productId').value;
        var productName = document.getElementById('productName').value;
        var productImg = document.getElementById('productImg').files[0];
        var productCost = document.getElementById('productCost').value;
        console.log(productImg)
        var tempProduct = {
            category: productCate,
            productId: productId,
            nameP: productName,
            img: productImg.name,
            price: productCost,
        };
        if (isNaN(productCost)) {
            alert("Vui lòng nhập lại giá của sản phẩm là số.");
            }
            else {
                existingProducts[index] = tempProduct;
        localStorage.setItem('product', JSON.stringify(existingProducts));
         // Tự động nhấn vào phần tử li tương ứng
        var pageNumberToClick = currentPage; // Thay đổi giá trị nếu cần thiết
        var liToClick = document.querySelector(`#pagination li:nth-child(${pageNumberToClick})`);
        if (liToClick) {
            liToClick.click();
        }
        document.getElementById('addProduct').style.display = "none";
        clearValueProduct(); 
    }
        
    }





//--------------------- phân vùng content--------------------------------

document.addEventListener("DOMContentLoaded", function() {
    var menuItems = document.querySelectorAll('.sidebar li');

    // Bắt sự kiện click cho mỗi mục menu
    menuItems.forEach(function(item, index) {
        item.addEventListener('click', function(event) {

            document.getElementById('addProduct').style.display="none";
            document.getElementById('tuan1').style.display = 'none'
            document.getElementById('tuan2').style.display = 'none'
            document.getElementById('adminAccount').style.display = 'none'  
            document.getElementById('add-submit').style.display = 'none';
            document.getElementById('addProduct').style.display = 'none';
            document.getElementById('add-update').style.display = 'block';
            document.getElementById('h2-cha').style.display = 'block';
            document.getElementById('h2-add').style.display = 'none';
            





            if (index === 0) {
                clearValueProduct();
                document.getElementById('listproduct').style.display = 'block'
                document.getElementById('addProduct').style.display = 'none'
                document.getElementById('tuan2').style.display = 'none'
                document.getElementById('tuan1').style.display = 'none'
                document.getElementById('adminAccount').style.display = 'none'  
                document.getElementById('tuan3').style.display = 'none'

            }


            if (index === 1) {
                clearValueProduct();
                document.getElementById('listproduct').style.display = 'block'
                document.getElementById('addProduct').style.display = 'block'
                document.getElementById('h2-add').style.display = 'block'
                document.getElementById('h2-cha').style.display = 'none'
                document.getElementById('add-update').style.display = 'none'
                document.getElementById('add-submit').style.display = 'block'
                document.getElementById('tuan2').style.display = 'none'
                document.getElementById('tuan1').style.display = 'none'
                document.getElementById('adminAccount').style.display = 'none'
                document.getElementById('oldImgs').style.display= 'none';
                document.getElementById('tuan3').style.display = 'none'

            }


            if (index === 2 ){
                document.getElementById('listproduct').style.display = 'none'
                document.getElementById('addProduct').style.display = 'none'
                document.getElementById('h2-add').style.display = 'none'
                document.getElementById('h2-cha').style.display = 'none'
                document.getElementById('add-update').style.display = 'none'
                document.getElementById('add-submit').style.display = 'none'
                document.getElementById('tuan2').style.display = 'none'
                document.getElementById('adminAccount').style.display = 'none'
                document.getElementById('tuan3').style.display = 'none'
                renderOrder()
                document.getElementById('tuan1').style.display = 'block'
            }

            if (index === 3 ){
                document.getElementById('listproduct').style.display = 'none'
                document.getElementById('addProduct').style.display = 'none'
                document.getElementById('h2-add').style.display = 'none'
                document.getElementById('h2-cha').style.display = 'none'
                document.getElementById('add-update').style.display = 'none'
                document.getElementById('add-submit').style.display = 'none'
                document.getElementById('tuan1').style.display = 'none'
                document.getElementById('adminAccount').style.display = 'none'
                document.getElementById('tuan3').style.display = 'none'
                renderUser()
                document.getElementById('tuan2').style.display = 'block'
            }

            
 
            if ( index === 4){
            document.getElementById('listproduct').style.display = 'none'
            document.getElementById('add-submit').style.display = 'none'
            document.getElementById('addProduct').style.display = 'none'
            document.getElementById('add-update').style.display = 'none'
            document.getElementById('h2-cha').style.display = 'none'
            document.getElementById('h2-add').style.display =  'none'
            document.getElementById('tuan2').style.display = 'none'
            document.getElementById('tuan1').style.display = 'none'
            document.getElementById('adminAccount').style.display = 'none'
            renderStat()
            document.getElementById('tuan3').style.display = 'block'

            }

            if (index === 5){
                document.getElementById('listproduct').style.display = 'none'
                 document.getElementById('add-submit').style.display = 'none'
                 document.getElementById('addProduct').style.display = 'none'
                 document.getElementById('add-update').style.display = 'none'
                 document.getElementById('h2-cha').style.display = 'none'
                 document.getElementById('h2-add').style.display =  'none'
                 document.getElementById('tuan2').style.display = 'none'
                 document.getElementById('tuan1').style.display = 'none'
                 document.getElementById('tuan3').style.display = 'none'
                 document.getElementById('adminAccount').style.display = 'block'
                 renderAdmin()
                 }

            
        });
    });
});
document.getElementById('tuan1').style.display = 'none'
document.getElementById('tuan2').style.display = 'none'
document.getElementById('tuan3').style.display = 'none'
document.getElementById('adminAccount').style.display = 'none'  
document.getElementById('add-submit').style.display = 'none';
document.getElementById('addProduct').style.display = 'none';
document.getElementById('add-update').style.display = 'block';
document.getElementById('h2-cha').style.display = 'block';
document.getElementById('h2-add').style.display = 'none';



let select = document.querySelectorAll('.menu li');

function reloadActive(){
    let lastActive = document.querySelector(".menu li.active");
    if (lastActive) {
        lastActive.classList.remove("active");
    }
    console.log(select);  
    select[active].classList.add("active");
}

select.forEach((li,key) => {
    li.addEventListener("click" , function() {
        active = key;
        reloadActive();
    });
});





//--------------------TUẤN JS -------------------






function renderOrder(){
    let orderList = JSON.parse(localStorage.getItem("order-list")) || [];
    let a = ` 
                <h1 class="text"><i style="margin-right : 10px" class="fa fa-list"></i> Danh Sách Đơn Hàng</h1>
                <table id=" orderTable">
                  <thead id="tHead">
                   <tr class="tHead">
                    <th>ID Đơn hàng</th>
                    <th>ID Khách hàng</th>
                    <th>Ngày lập đơn</th>
                    <th>Tình trạng đơn hàng</th>
                    <th>Thao tác</th>
                   </tr>
                  </thead>
                 <tbody>`

   orderList.map((value, index) =>{
    a += `<tr>
    <td>${value.id} </td>
    <td>${value.user}</td>
    <td>${value.date}</td>
    <td>${value.status}</td>
    <td class="action-btn-container">
        <button onclick="view_detail(${value.id})">Xem chi tiết</button>
        <button onclick="resolve_order(${index})">Xử lý đơn</button>
    </td>
</tr>`
   })

   a += `</tbody></table>`
   document.getElementById("orderList").innerHTML = a

}


function view_detail(orderID){
    let detailList = JSON.parse(localStorage.getItem("order-detail")) ||[];
    let product = JSON.parse(localStorage.getItem("product")) || [];
    let a = `<span>
    <h1 >Chi tiết đơn hàng</h1>
    </span>
    <form>
        <div style = "display : flex ; justify-content: center  ; align-items: center;">
            <label>ID Đơn hàng:</label>
            <input value="${orderID}">
        </div>
         <table id="orderTable" style="font-size: 20px">
         <thead>
         <th>STT</th>
         <th>Mã sản phẩm</th>
         <th>Tên sản phẩm</th>
         <th>Số lượng </th>
         <th>Đơn giá</th>
         <th>Ảnh</th>
         </thead> `

    let num =0;
    for ( var i =0; i< detailList.length; i++){
        if ( detailList[i].id ==orderID){
            num+= 1
            for ( let k =0; k < product.length; k++){
                if ( detailList[i].product_id == product[k].productId){
                    var nameP = product[k].nameP
                    var img = product[k].img
                    break;
                }
            }
             a +=  `
                    <tr>
                    <td>${num}</td>
                    <td>${detailList[i].product_id} </td>
                    <td>${nameP} </td>
                    <td>${detailList[i].quantity} </td>
                    <td>${detailList[i].unit_price}${'$'}</td>
                    <td>
                    <img src="../img/${img}" width="40%" height ="40%">
                    </td>
                    </tr>
                   `
        }
    }
       a+= ` </table></div> <input style = "position : relative ; left : 40%" type="button" value="OK" onclick="closeForm('view_detail')">
    </form>`

    document.getElementById("view_detail").innerHTML = a
    document.getElementById("finish_order").style.display = "none"
    document.getElementById("view_detail").style.display = " block"

}


function resolve_order(index){
    let orderList = JSON.parse(localStorage.getItem("order-list")) || []
    if ( orderList[index].status == "Đã hoàn thành" ||orderList[index].status == "Đã hủy"  ){
        alert("Đơn hàng đã được xử lý")
        return 0
    }
    let a = `<h1> Xử lý đơn</h1>
<form>
    <label>ID Đơn: </label>
    <input value="${orderList[index].id}">
    <label>Chọn tình trạng đơn hàng</label>
    <select id="select">
    <option value="Chưa xử lý">Chưa xử lý</option>
    <option value="Đã hoàn thành">Đã hoàn thành</option>
    <option value="Đang giao">Đang giao</option>
    <option value="Đã hủy">Đã hủy</option>
    </select>
     <input type="button" value="Xử lý đơn" onclick="finishOrder(${index})">
</form>`

    document.getElementById("finish_order").innerHTML = a
    document.getElementById("view_detail").style.display = " none"
    document.getElementById("finish_order").style.display = "block"

}


function finishOrder(index){
    let orderList = JSON.parse(localStorage.getItem("order-list")) || []

    orderList[index].status = document.getElementById("select").value;
    
    localStorage.setItem("order-list", JSON.stringify(orderList))
    renderOrder()
    document.getElementById("finish_order").style.display ="none"
   

}


function renderUser(){
    let userList = JSON.parse(localStorage.getItem("user-list")) ||[]
    let a = ` <h1 class="header" style="display: flex; justify-content : center"><i style="margin-right : 10px " class="fa fa-user"></i> Danh Sách User</h1>
    <button class="addUser-btn" onclick="addUser()"><i class="fa fa-plus"></i> Thêm User Mới </button>
                <table id=" userTable">
                  <thead id="tHead">
                   <tr class="tHead">
                    <th>ID User</th>
                    <th>Họ tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Mật khẩu</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Thao tác</th>
                   </tr>
                  </thead>
                 <tbody>`

   userList.map((value, index) =>{
    a += `<tr>
    <td>${value.id} </td>
    <td>${value.fullname}</td>
    <td>${value.username}</td>
    <td>${value.password}</td>
    <td>${value.email}</td>
    <td>${value.phonenumber}</td>
    <td class="action-btn-container">
        <button onclick="editUser(${index})">Sửa</button>
        <button onclick="deleteUser(${index})">Xóa</button>
    </td>
</tr>`
   })

   a += `</tbody></table>`
   document.getElementById("userList").innerHTML = a
}

function editUser(index){
    let userList = JSON.parse(localStorage.getItem("user-list")) ||[]
     let a = ` 
     <span>
        <h1>Chỉnh sửa thông tin User </h1>
        <div style = "display : flex ; justify-content: end;" >
            <button onclick="closeForm('editUser')" class="close-btn">X</button>
        </div>
     </span>
     <form style = "display : flex ; flex-direction: column; justify-content : center  ">
         <div style = "display : flex">
            <label>ID User:</label>
            <input id="iduser" value="${userList[index].id}">
         </div>
         <div style = "display : flex">
            <label>Họ tên:</label>
            <input id="fullname" value="${userList[index].fullname}">
         </div>
         <div style = "display : flex">
            <label>Tên đăng nhập:</label>
            <input id="username" value="${userList[index].username}">
         </div>
         <div style = "display : flex">
            <label>Mật khẩu:</label>
            <input id="password" type="password" value="${userList[index].password}">
         </div>
         <div style = "display : flex">
            <label>Email:</label>
            <input id="email" value="${userList[index].email}">
         </div>
         <div style = "display : flex">
            <label>Số điện thoại:</label>
            <input id="phonenumber" value="${userList[index].phonenumber}">
         </div>
         <input type="button" value="Lưu thay đổi" onclick= "changeUser(${index})"> 
     </form>`

     document.getElementById("addUser").style.display = "none"
     document.getElementById("editUser").innerHTML = a
     document.getElementById("editUser").style.display = "block"
}

function changeUser(index){
    let userList = JSON.parse(localStorage.getItem("user-list")) || []
    let id = document.getElementById('iduser').value
    let fullname =  document.getElementById('fullname').value
    let username =  document.getElementById('username').value
    let password =  document.getElementById('password').value
    let email =  document.getElementById('email').value
    let phonenumber =  document.getElementById('phonenumber').value

//CHECK EXISTING ID & ACCOUNT
for ( let i=0; i<userList.length; i++){
  if (id == userList[i].id && i != index){

    
    alert("ID đã tồn tại, vui lòng nhập một ID khác")
    return 0
  }
}
       //VALIDATE FORM
       let validationResult = validateCustomerForm(username, password, email, phonenumber)
    if (validationResult === true) {
       let cfr = confirm("Xác nhận lưu thay đổi thông tin User ?")
       if ( cfr == true){
    userList[index] = {
        id : document.getElementById('iduser').value,
        fullname :  document.getElementById('fullname').value,
        username :  document.getElementById('username').value,
        password :  document.getElementById('password').value,
        email :  document.getElementById('email').value,
        phonenumber :  document.getElementById('phonenumber').value
    }
    localStorage.setItem('user-list', JSON.stringify(userList))
    renderUser();
    document.getElementById("editUser").style.display ="none"
       }
    }  else {
        alert(validationResult) // In ra thông báo lỗi nếu thông tin không hợp lệ
    }
}

function deleteUser(index){
    let userList = JSON.parse(localStorage.getItem("user-list")) || []
    let cfr = confirm("Bạn muốn xóa User này chứ ?")
    if (cfr){
        userList.splice(index, 1)
        localStorage.setItem('user-list', JSON.stringify(userList))
        renderUser(); 
    }
    document.getElementById("editUser").style.display = "none"
   
}

function addUser(){
    let a = ` 
    <span>
        <h1>Tạo User </h1>
        <div style = "display : flex ; justify-content: end;" >
            <button onclick="closeForm('addUser')" class="close-btn">X</button>
        </div>
    </span>
    <form style = "display : flex ; flex-direction: column; justify-content : center  ">
        <div style = "display : flex">
            <label>ID User:</label>
            <input id="new_id">
        </div>
        <div style = "display : flex"> 
            <label>Họ tên:</label>
            <input id="new_fullname">
        </div>
        <div style = "display : flex">
            <label>Tên đăng nhập:</label>
            <input id="new_username">
        </div>
        <div style = "display : flex">
            <label>Mật khẩu:</label>
            <input id="new_password" type="password">
        </div>
        <div style = "display : flex">
            <label>Email:</label>
            <input id="new_email">
        </div>
        <div style = "display : flex">
            <label>Số điện thoại:</label>
            <input id="new_phonenumber">
        </div>
        <input type="button" value="Tạo" onclick="createUser()"> 
    </form>`
     document.getElementById("editUser").style.display = "none"
     document.getElementById("addUser").innerHTML = a
     document.getElementById("addUser").style.display = "block"

    
}

function validateCustomerForm(username, password, email, phonenumber) {
    if (username.length < 6 || !(/\d/.test(username))) {
        return 'Tên đăng nhập phải có ít nhất 6 ký tự và phải chứa ít nhất một số.';
    }

    if (password.length < 6 || !(/\d/.test(password))) {
        return 'Mật khẩu phải có ít nhất 6 ký tự và phải chứa ít nhất một số.';
    }

    if (!email.includes('@') || !email.includes('.')) {
        return 'Email phải có định dạng hợp lệ (ví dụ: example@gmail.com).';
    }

    if (!(phonenumber.startsWith('0') && phonenumber.length === 10)) {
        return 'Số điện thoại phải có 10 số và bắt đầu bằng số 0.';
    }

    return true; // Trả về true nếu thông tin hợp lệ
}


function createUser(){

    let id = document.getElementById('new_id').value
    let fullname = document.getElementById('new_fullname').value
    let username = document.getElementById('new_username').value
    let password = document.getElementById('new_password').value
    let email = document.getElementById('new_email').value
    let phonenumber = document.getElementById('new_phonenumber').value

    //CHECK EXISTING ID
let userList = JSON.parse(localStorage.getItem("user-list")) || []
for ( let i=0; i<userList.length; i++){
  if (id == userList[i].id){
    alert("ID đã tồn tại, vui lòng nhập một ID khác")
    return 0
  }
}

     // VALIDATE FORM
    let validationResult = validateCustomerForm(username, password, email, phonenumber);
    if (validationResult === true) {
       let cfr = confirm("Xác nhận tạo User mới ?")
    if ( cfr == true){
    userList.push ({
        id : document.getElementById('new_id').value,
        fullname :  document.getElementById('new_fullname').value,
        username :  document.getElementById('new_username').value,
        password :  document.getElementById('new_password').value,
        email :  document.getElementById('new_email').value,
        phonenumber :  document.getElementById('new_phonenumber').value
    })
    localStorage.setItem('user-list', JSON.stringify(userList))
    renderUser();
    document.getElementById("addUser").style.display ="none" 
}   
} else {
    alert(validationResult) 
}
}

function renderAdmin(){
    let account = JSON.parse(localStorage.getItem("account")) || []
    let a = ` <h1 class="header"><i class="fa fa-gear"></i> Thiết Lập Tài Khoản</h1>
    <div class="admin-cotainer">
        <form>
            <div class="admin-container">
                <label>Tên đăng nhập: </label>
                <input id="admin_username" type="button" value="${account.username}">
                <label>Mật khẩu: </label>
                <input id="admin_password" type="button" value="${account.password}">
                <label>Email: </label>
                <input id="admin_email"type="button" value=${account.email}>
                <label>Điện thoại: </label>
                <input id="admin_phonenumber" type="button" value="${account.phonenumber}">
            <div class="action-container">
                <button  id="save-btn" type='button' onclick="saveAccount()" style="display:none"><i class="fa fa-save"></i> Lưu
                <button id="edit-btn" type='button' onclick="editAccount()"><i class="fa fa-pencil"></i> Chỉnh sửa</button>
                <button id="logout-btn" type='button'onclick="closeForm('adminAccount')"><i class="fa fa-power-off"></i> Đăng xuất</button>
            </div>
            </div>
        </form>
    </div>`


    document.getElementById("adminAccount").innerHTML = a;

}

function editAccount(){
  document.getElementById("admin_username").type= "text";
  document.getElementById("admin_password").type= "text";
  document.getElementById("admin_email").type= "text";
  document.getElementById("admin_phonenumber").type= "text";

  document.getElementById("save-btn").style.display = "inline-block"
  document.getElementById("edit-btn").style.display= "none"

}

function saveAccount(){

    let cfr = confirm("Xác nhận chỉnh sửa ")
    if ( cfr == true){
    let adminAcc = JSON.parse(localStorage.getItem("account")) || []
    adminAcc = {
        username:  document.getElementById("admin_username").value,
        password:  document.getElementById("admin_password").value,
        email:  document.getElementById("admin_email").value,
        phonenumber: document.getElementById("admin_phonenumber").value
    }

    localStorage.setItem('account', JSON.stringify(adminAcc))
    alert("Chỉnh sửa thành công")
}
    renderAdmin()
    
}

function closeForm(name){
    document.getElementById(name).style.display = "none"

}
 

function renderStat(){
    let a = ` 
                <h1 class="text"><i style="margin-right : 10px" class="fa fa-signal"></i> Thống kê doanh thu sản phẩm</h1>
        
    <div class="getDate-container">

        
         <div>
            <label class="dateLabel">Ngày bắt đầu:</label>
            <select id="getSday">
            </select>
         <div>
         <div>
            <label class="dateLabel">Tháng:</label>
            <select id="getSMonth">
            <option value="1">Tháng 1</option>
            <option value="2">Tháng 2</option>
            <option value="3">Tháng 3</option>
            <option value="4">Tháng 4</option>
            <option value="5">Tháng 5</option>
            <option value="6">Tháng 6</option>
            <option value="7">Tháng 7</option>
            <option value="8">Tháng 8</option> 
            <option value="9">Tháng 9</option>
            <option value="10">Tháng 10</option>
            <option value="11">Tháng 11</option>
            <option value="12">Tháng 12</option>
            </select>
         </div>
      


   
            <div>
              <label class="dateLabel">Ngày kết thúc:</label>
              <select id="getEday">
              </select>
            </div>
            
            <div>
                <label class="dateLabel">Tháng:</label>
                <select id="getEMonth">
                <option value="1">Tháng 1</option>
                <option value="2">Tháng 2</option>
                <option value="3">Tháng 3</option>
                <option value="4">Tháng 4</option>
                <option value="5">Tháng 5</option>
                <option value="6">Tháng 6</option>
                <option value="7">Tháng 7</option>
                <option value="8">Tháng 8</option> 
                <option value="9">Tháng 9</option>
                <option value="10">Tháng 10</option>
                <option value="11">Tháng 11</option>
                <option value="12">Tháng 12</option>
                </select>
            </div>
    

     
            <div>
                <label class="dateLabel">Năm:</label>
                <select id="getYear">
                </select>
            </div>
            <div>
                 <label class="dateLabel">Loại sản phẩm:</label>
                 <select id="getCategory">
                 <option value="all">Tất cả</option>
                 <option value="chó">Chó</option>
                 <option value="mèo">Mèo</option>
                 <option value="Đồ Ăn">Đồ ăn</option>
                 <option value="Đồ chơi">Đồ chơi</option>
                 </select>
            </div>
            <div>
                <input type="button" value="Thống kê" id="stat-btn" onclick="calculateRevenue()">
            </div>
        </div>
    </div> 

    <div>

                <table id=" statTable" style="margin-top: 20px; background-color:#fff">
                  <thead id="tHead">
                   <tr class="tHead" style="font-size: 22px">
                    <th>ID</th>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Sold</th>
                    <th>Monthly Revenue</th>
                   </tr>
                  </thead>
                 <tbody id="PRS">`

   a += `</tbody></table></div>`
   document.getElementById("statistics").innerHTML = a

   //   PRS = product revenue statistics
   
const selectElement = document.getElementById("getYear")
const selectElement2 = document.getElementById("getSday")
const selectElement3 = document.getElementById("getEday")
const selectElement4 = document.getElementById("getEMonth")

for (let year = 1985; year <= 2024; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    selectElement.appendChild(option);
}

for (var sday= 1; sday <= 31; sday++) {
    var option = document.createElement('option');
    option.value = sday;
    option.textContent = sday;
    selectElement2.appendChild(option);
}


document.getElementById('getSday').addEventListener('change', function(event) {
    var eday = event.target.value;
    console.log('Option đã chọn:', eday)
    for ( let day = eday ; day <= 31; day++) {
        var option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        selectElement3.appendChild(option);
    }
  });

  document.getElementById('getSMonth').addEventListener('change', function(event) {
    var emonth = event.target.value;
    console.log('Option đã chọn:', eday)
    for ( let month = emonth ; month <= 12; month++) {
        var option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        selectElement3.appendChild(option);
    }
  });
}

function calculateRevenue(){
    var startDay = parseInt(document.getElementById('getSday').value,10)
    var endDay= parseInt(document.getElementById('getEday').value,10)
    var smonthRevenue = parseInt(document.getElementById('getSMonth').value,10)
    var emonthRevenue = parseInt(document.getElementById('getEMonth').value,10)

    var yearRevenue = parseInt(document.getElementById('getYear').value,10)
    var categoryRevenue = document.getElementById('getCategory').value
    console.log(startDay)
    console.log(endDay)
    console.log(smonthRevenue)
    console.log(emonthRevenue)
    console.log(yearRevenue)
    console.log(categoryRevenue)

    var productArray = JSON.parse(localStorage.getItem('product')) || []
    var orderDetail = JSON.parse(localStorage.getItem('order-detail')) || []
    var orderArray = JSON.parse(localStorage.getItem('order-list')) || []


    // LỌC RA CÁC HÓA ĐƠN & CHI TIẾT HÓA ĐƠN TRONG THỜI GIAN CẦN THỐNG KÊ

    var filterInvoices = [] // mảng lưu chi tiết hóa đơn được lọc ra
    for ( let i=0; i < orderArray.length; i++){
    let date = orderArray[i].date;
    let dateParts = date.split('-'); 
    let day = parseInt(dateParts[0], 10);  
    let month = parseInt(dateParts[1], 10); 
    let year = parseInt(dateParts[2], 10); 
    console.log(day)
    console.log(month)
    console.log(year)
        if ( day >= startDay && day <= endDay  && month >= smonthRevenue && month <= emonthRevenue  && year == yearRevenue ){
           console.log("true")
            for ( let j = 0; j < orderDetail.length; j++){
                if (orderArray[i].id == orderDetail[j].id){
                    filterInvoices.push({
                        id : orderDetail[j].id,
                        productId : orderDetail[j].product_id,
                        quantity : orderDetail[j].quantity,
                        price : orderDetail[j].unit_price
                    })
                }
            }
        }
    }
    console.log(filterInvoices)

var productRevenue = []

    for ( let i=0; i < productArray.length; i++){
        let count = 0
        for ( let j=0; j < filterInvoices.length; j++){
            if ( productArray[i].productId == filterInvoices[j].productId ){
                count++;
            }
        }
        if (count > 0){
            productRevenue.push({
                id : productArray[i].productId,
                category : productArray[i].category,
                nameP : productArray[i].nameP,
                img : productArray[i].img,
                price : productArray[i].price,
                amountSold : count,
                revenue : productArray[i].price * count
            })
        } 
    }
    console.log(productRevenue)
    let a = ''
    for ( let i=0; i < productRevenue.length; i++){
        if ( productRevenue[i].category == categoryRevenue || categoryRevenue == "all"){
    a += `<tr>
           <td>${productRevenue[i].id} </td>
           <td>${productRevenue[i].category} </td>
           <td>${productRevenue[i].nameP} </td>
           <td><img src="../img/${productRevenue[i].img}" width="80%" height ="80%"></td>
           <td>${productRevenue[i].price}${'$'} </td>
           <td>${productRevenue[i].amountSold} </td>
           <td>${productRevenue[i].revenue}${'$'} </td>
          </tr>`
    }
   
}
console.log(a)
document.getElementById("PRS").innerHTML = a
}
