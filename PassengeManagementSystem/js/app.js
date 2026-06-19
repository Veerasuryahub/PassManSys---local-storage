// ====================================
// PASSENGER MANAGEMENT SYSTEM
// APP.JS PART 1
// ====================================



// ====================================
// DEMO LOGIN USER
// ====================================

const DEMO_USER={

userId:"travel123",

password:"Travel@123"

};




// ====================================
// INITIALIZE DEMO DATA
// ====================================

function initializeData(){


if(!localStorage.getItem("passengers")){


const passengers=[


{

pnr:"PNR1001",

name:"Surya",

age:22,

gender:"Male",

origin:"Madurai",

destination:"Chennai",

train:"TN01",

price:650

},



{

pnr:"PNR1002",

name:"Arun",

age:25,

gender:"Male",

origin:"Coimbatore",

destination:"Salem",

train:"TN02",

price:500

},



{

pnr:"PNR1003",

name:"Priya",

age:24,

gender:"Female",

origin:"Trichy",

destination:"Chennai",

train:"TN03",

price:720

},



{

pnr:"PNR1004",

name:"Anitha",

age:28,

gender:"Female",

origin:"Erode",

destination:"Madurai",

train:"TN04",

price:450

}


];


localStorage.setItem(

"passengers",

JSON.stringify(passengers)

);


}


}




initializeData();




// ====================================
// GET ALL PASSENGERS
// ====================================

function getPassengers(){


return JSON.parse(

localStorage.getItem(

"passengers"

)

)

||

[];


}





// ====================================
// SAVE PASSENGERS
// ====================================

function savePassengers(

passengers

){


localStorage.setItem(

"passengers",

JSON.stringify(

passengers

)

);


}





// ====================================
// LOGIN
// ====================================

function login(){


let userid=

document

.getElementById(

"userid"

)

.value

.trim();



let password=

document

.getElementById(

"password"

)

.value

.trim();




// empty validation


if(

userid===""

||

password===""

){


showToast(

"Please fill all fields",

"error"

);


return;


}




// userid validation


const userRegex=

/^[a-zA-Z0-9]{8,}$/;



if(

!userRegex.test(

userid

)

){


showToast(

"User ID minimum 8 characters",

"error"

);


return;


}




// password validation


const passRegex=

/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/;



if(

!passRegex.test(

password

)

){


showToast(

"Invalid Password Format",

"error"

);


return;


}




// login check


if(

userid===DEMO_USER.userId

&&

password===DEMO_USER.password

){


localStorage.setItem(

"loggedIn",

"true"

);



showToast(

"Login Successful",

"success"

);




setTimeout(()=>{


window.location.href=

"pages/dashboard.html";


},1000);



}



else{


showToast(

"Invalid Credentials",

"error"

);


}



}




// ====================================
// LOGOUT
// ====================================

function logout(){



let ok=

confirm(

"Are you sure to Logout ?"

);



if(ok){



localStorage.removeItem(

"loggedIn"

);



window.location.href=

"../index.html";



}



}




// ====================================
// CHECK SESSION
// ====================================

function checkLogin(){



if(


localStorage.getItem(

"loggedIn"

)

!==

"true"


){



alert(

"Please Login"

);



window.location.href=

"../index.html";



}



}




// ====================================
// TOTAL PASSENGERS
// ====================================

function totalPassengers(){


return

getPassengers()

.length;


}




// ====================================
// MALE COUNT
// ====================================

function totalMale(){


return

getPassengers()

.filter(

p=>

p.gender==="Male"

)

.length;


}




// ====================================
// FEMALE COUNT
// ====================================

function totalFemale(){


return

getPassengers()

.filter(

p=>

p.gender==="Female"

)

.length;


}




// ====================================
// TOTAL REVENUE
// ====================================

function totalRevenue(){



let passengers=

getPassengers();



let total=0;



passengers.forEach(


p=>{


total+=

Number(

p.price

);


}


);



return total;



}




// ====================================
// DASHBOARD STATS
// ====================================

function dashboardStats(){



if(

document.getElementById(

"totalPassengers"

)

){



document

.getElementById(

"totalPassengers"

)

.innerHTML=


totalPassengers();




document

.getElementById(

"maleCount"

)

.innerHTML=


totalMale();




document

.getElementById(

"femaleCount"

)

.innerHTML=


totalFemale();




document

.getElementById(

"totalRevenue"

)

.innerHTML=


"₹ "

+

totalRevenue();



}



}




// ====================================
// DUPLICATE PNR CHECK
// ====================================

function isDuplicatePNR(

pnr

){



let passengers=

getPassengers();



return passengers.some(


p=>

p.pnr

.toUpperCase()

===

pnr

.toUpperCase()


);



}




// ====================================
// FIND PASSENGER
// ====================================

function findPassenger(

pnr

){



let passengers=

getPassengers();



return passengers.find(


p=>

p.pnr

.toUpperCase()

===

pnr

.toUpperCase()


);



}




// ====================================
// TOAST MESSAGE
// ====================================

function showToast(

message,

type

){



let toast=

document

.getElementById(

"toast"

);




if(!toast){


alert(

message

);


return;


}




toast.innerHTML=

message;



toast.style.display=

"block";



if(

type==="success"

){


toast.style.background=

"#10B981";


}



else{


toast.style.background=

"#EF4444";


}




setTimeout(()=>{


toast.style.display=

"none";


},3000);



}




// ====================================
// RESET DATABASE
// ====================================

function resetDatabase(){



localStorage.removeItem(

"passengers"

);



initializeData();



showToast(

"Database Reset",

"success"

);



}




console.log(

"Passenger Management System Loaded"

);

console.log(

getPassengers()

);

// ====================================
// ADD PASSENGER
// ====================================

function addPassenger(){


let pnr=

document

.getElementById("pnr")

.value

.trim();



let name=

document

.getElementById("name")

.value

.trim();



let age=

document

.getElementById("age")

.value;



let gender=

document

.getElementById("gender")

.value;



let origin=

document

.getElementById("origin")

.value

.trim();



let destination=

document

.getElementById("destination")

.value

.trim();



let train=

document

.getElementById("train")

.value

.trim();



let price=

document

.getElementById("price")

.value;





if(

pnr===""

||

name===""

||

age===""

||

origin===""

||

destination===""

||

train===""

||

price===""

){

showToast(

"Please fill all fields",

"error"

);

return;

}



if(

isDuplicatePNR(pnr)

){

showToast(

"PNR already exists",

"error"

);

return;

}



if(

age<=0

){

showToast(

"Invalid Age",

"error"

);

return;

}



if(

price<=0

){

showToast(

"Invalid Ticket Price",

"error"

);

return;

}





let passengers=

getPassengers();



passengers.push({

pnr,

name,

age,

gender,

origin,

destination,

train,

price

});



savePassengers(

passengers

);



showToast(

"Passenger Added Successfully",

"success"

);




document

.getElementById(

"passengerForm"

)

.reset();




dashboardStats();

}





// ====================================
// VIEW ALL PASSENGERS
// ====================================

function displayPassengers(){



let tbody=

document

.getElementById(

"tbody"

);



if(!tbody)

return;



tbody.innerHTML="";



let passengers=

getPassengers();




passengers.forEach(

(p,index)=>{



tbody.innerHTML+=`

<tr>

<td>

${p.pnr}

</td>

<td>

${p.name}

</td>

<td>

${p.age}

</td>

<td>

${p.gender}

</td>

<td>

${p.origin}

</td>

<td>

${p.destination}

</td>

<td>

${p.train}

</td>

<td>

₹ ${p.price}

</td>

<td>


<button

class="btn"

onclick=

"editPassenger('${p.pnr}')"

>

Edit

</button>



<button

class="btn-danger"

onclick=

"deletePassenger('${p.pnr}')"

>

Delete

</button>


</td>


</tr>

`;


}


);



}





// ====================================
// DELETE PASSENGER
// ====================================

function deletePassenger(

pnr

){



let ok=

confirm(

"Delete Passenger ?"

);



if(!ok)

return;




let passengers=

getPassengers();




passengers=

passengers.filter(

p=>

p.pnr!==pnr

);




savePassengers(

passengers

);




showToast(

"Passenger Deleted",

"success"

);




displayPassengers();




dashboardStats();



}





// ====================================
// EDIT PASSENGER
// ====================================

function editPassenger(

pnr

){



localStorage.setItem(

"editPNR",

pnr

);




window.location.href=

"updatePassenger.html";



}





// ====================================
// LOAD UPDATE DATA
// ====================================

function loadPassenger(){



let pnr=

localStorage.getItem(

"editPNR"

);



if(!pnr)

return;




let passenger=

findPassenger(

pnr

);




if(!passenger)

return;





document

.getElementById(

"pnr"

)

.value=

passenger.pnr;



document

.getElementById(

"pnr"

)

.readOnly=true;




document

.getElementById(

"name"

)

.value=

passenger.name;




document

.getElementById(

"age"

)

.value=

passenger.age;




document

.getElementById(

"gender"

)

.value=

passenger.gender;




document

.getElementById(

"origin"

)

.value=

passenger.origin;




document

.getElementById(

"destination"

)

.value=

passenger.destination;




document

.getElementById(

"train"

)

.value=

passenger.train;




document

.getElementById(

"price"

)

.value=

passenger.price;



}





// ====================================
// UPDATE PASSENGER
// ====================================

function updatePassenger(){



let passengers=

getPassengers();




let updatedPassenger={


pnr:

document

.getElementById(

"pnr"

)

.value,



name:

document

.getElementById(

"name"

)

.value,



age:

document

.getElementById(

"age"

)

.value,



gender:

document

.getElementById(

"gender"

)

.value,



origin:

document

.getElementById(

"origin"

)

.value,



destination:

document

.getElementById(

"destination"

)

.value,



train:

document

.getElementById(

"train"

)

.value,



price:

document

.getElementById(

"price"

)

.value


};





passengers=

passengers.map(

p=>

p.pnr

===

updatedPassenger.pnr

?

updatedPassenger

:

p

);




savePassengers(

passengers

);




showToast(

"Passenger Updated",

"success"

);




dashboardStats();




setTimeout(()=>{


window.location.href=

"viewPassenger.html";


},1000);



}





// ====================================
// SEARCH PASSENGER
// ====================================

function searchPassenger(){



let pnr=

document

.getElementById(

"searchPNR"

)

.value

.trim();





let passenger=

findPassenger(

pnr

);




let result=

document

.getElementById(

"searchResult"

);





if(!result)

return;





if(passenger){



result.innerHTML=`

<div class="passenger-card">


<h2>

Passenger Details

</h2>


<p>

PNR :

${passenger.pnr}

</p>


<p>

Name :

${passenger.name}

</p>


<p>

Age :

${passenger.age}

</p>


<p>

Gender :

${passenger.gender}

</p>


<p>

Origin :

${passenger.origin}

</p>


<p>

Destination :

${passenger.destination}

</p>


<p>

Train :

${passenger.train}

</p>


<p>

Ticket Price :

₹ ${passenger.price}

</p>


</div>

`;



}



else{



result.innerHTML=`

<div class="passenger-card">


<h2>

Passenger Not Found

</h2>


</div>

`;



}



}





// ====================================
// SEARCH FILTER TABLE
// ====================================

function filterPassengers(){



let search=

document

.getElementById(

"searchBox"

)

.value

.toUpperCase();




let rows=

document

.querySelectorAll(

"#tbody tr"

);




rows.forEach(


row=>{


let pnr=

row.children[0]

.innerText

.toUpperCase();




if(

pnr.includes(

search

)

){

row.style.display="";

}

else{

row.style.display="none";

}


}


);



}





// ====================================
// AUTO LOAD
// ====================================

window.onload=()=>{


dashboardStats();


displayPassengers();


loadPassenger();


}