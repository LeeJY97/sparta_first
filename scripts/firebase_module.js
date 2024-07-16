 // firbase module
 // CORS 문제 해결가능하면 해당 코드도 하나로 관리할 예정 (가능하면..)
 
 // Firebase SDK 라이브러리 가져오기
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
 import {
     getFirestore,
     doc,
     getDocs,
     collection,
     addDoc,
     updateDoc,
     deleteDoc,
     deleteField,
     query,
     orderBy,
     limit,
 } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

 // Firebase 구성 정보 설정
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
     apiKey: "AIzaSyD0oERzI0jnFGWaAR8NaYPkGqGYft-NOfs",
     authDomain: "sparta-test-71931.firebaseapp.com",
     projectId: "sparta-test-71931",
     storageBucket: "sparta-test-71931.appspot.com",
     messagingSenderId: "557999158224",
     appId: "1:557999158224:web:799f97b40ab8e897293fd5",
     measurementId: "G-1QGVSEZ52D",
 };

 // Firebase 인스턴스 초기화
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);

//  const name = $('#name').text();