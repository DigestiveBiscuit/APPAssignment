/*
APP Assignment

Last Edit: 22:57PM Thursday 2020
Last Task: Commenting Code, Creating README.
*/

function getUsers(page) {
 const xhr = new XMLHttpRequest();
 xhr.open("GET", "api/users?page=" + (page), true);
 xhr.onload = function() {

  if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
   const objUsers = JSON.parse(xhr.responseText);
   renderUsers(objUsers);
  } else {
   alert("Error " + xhr.status);
  }
 }
 xhr.send();
}

function renderUsers(objUsers) {
 const table = document.getElementById("tblUsersBody");
 table.innerHTML = "";


 for (let objUser in objUsers.data) {

  document.getElementById('pageNumber').innerHTML = objUsers.page;
  document.getElementById('totalPages').innerHTML = objUsers.total_pages;
  const row = table.insertRow(0);

  row.className = "w3-card w3-marina";
  row.id = "user" + objUsers.data[objUser].user_id;
  row.addEventListener("click", function() {
   const xhr = new XMLHttpRequest();
   xhr.open('GET', "/api/users/" + this.id, true);
   xhr.onload = function() {
    if (xhr.status === 200) {
     let data = JSON.parse(xhr.responseText);
     document.getElementById('userID').innerText = data.user_id;
     document.getElementById('userEmail').value = data.email;
     document.getElementById('userFirstName').value = data.first_name;
     document.getElementById('userLastName').value = data.last_name;
    }
   }
   xhr.send();
  })

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);
  const cell5 = row.insertCell(4);
  cell5.className = "w3-container w3-white";
  cell1.innerHTML = objUsers.data[objUser].user_id;
  cell2.innerHTML = objUsers.data[objUser].email;
  cell3.innerHTML = objUsers.data[objUser].first_name;
  cell4.innerHTML = objUsers.data[objUser].last_name;
  cell5.innerHTML = "<img style='height: 64px; width: 64px' src=" + objUsers.data[objUser].avatar + " alt='avatar' >"
 }
}

document.getElementById('btnDeleteUser').onclick = function() {
 deleteUser()
}
//TODO delete user: set button state disabled/enabled after after validation check

function deleteUser() {
 let userToDelete = document.getElementById('userID');

 const xhr = new XMLHttpRequest();
 xhr.open("DELETE", "/api/users/" + userToDelete.innerText, true)
 xhr.onload = function() {
  if (xhr.status === 204) {
   alert('User Deleted');
   getUsers(1);
  } else {
   alert('Error: ' + xhr.status);
  }

 }
 xhr.send()
}


document.getElementById('btnNewUser').onclick = function() {
 createUser();
}
//TODO create user: set button state disabled/enabled after after validation check

function createUser() {
 let form = new FormData();

 form.append('email', document.getElementById('frmUserEmail').value);
 form.append('first_name', document.getElementById('frmUserFirstName').value);
 form.append('last_name', document.getElementById('frmUserLastName').value);
 form.append('avatar', "https://cdn.discordapp.com/attachments/168439091824689152/712379647672975400/yepcock.png");
 //TODO add avatar file upload, drag and drop.
 //TODO input validation

 const xhr = new XMLHttpRequest();
 xhr.open("POST", "/api/users", true);
 xhr.onload = function() {
  if (xhr.status === 201) {
   alert('User Added');
   getUsers(document.getElementById('pageNumber').innerText);
  } else {
   alert("Error " + xhr.status);
  }
 }
 xhr.send(form);
}


document.getElementById('btnSaveUser').onclick = function() {
 saveUser();
}
//TODO save/edit user: set button state disabled/enabled after after validation check

function saveUser() {
 let form = new FormData();
 let user = document.getElementById('userID')

 form.append('email', document.getElementById('userEmail').value);
 form.append('first_name', document.getElementById('userFirstName').value);
 form.append('last_name', document.getElementById('userLastName').value);
 form.append('avatar', "https://cdn.discordapp.com/attachments/168439091824689152/712379647672975400/yepcock.png");

 const xhr = new XMLHttpRequest();
 xhr.open("PUT", "/api/users/" + user.innerText, true);
 xhr.onload = function() {
  if (xhr.status === 200) {
   alert('User Edited');
   getUsers(document.getElementById('pageNumber').innerText);
  } else {
   alert("Error " + xhr.status);
  }
 }
 xhr.send(form);
}

// next page and previous page button, checks to see if the current page is within the bounds of the page amount
document.getElementById("btnNext").onclick = function() {
 let page_num = Number(document.getElementById('pageNumber').innerText);
 let max_page = Number(document.getElementById('totalPages').innerText);
 let next_page = page_num + 1;
 if (next_page <= max_page) {
  getUsers(next_page);
 }
}


document.getElementById("btnPrevious").onclick = function() {
 let page_num = Number(document.getElementById('pageNumber').innerText);
 let prev_page = page_num - 1;
 if (prev_page >= 1) {
  getUsers(prev_page);
 }
}


function initPage() {
 getUsers(1)
}


initPage();