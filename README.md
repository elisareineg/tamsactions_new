# Tamsactions

## You can find this project on my account at the repository tamsactions_new, or at https://tamsactions.web.app

## The goal of this SPA is to create a web application for Queen's students to be able to trade in extra meal currency they have not used in exchange for real money. 

## I used a mixture of Javascript, Typescript, CSS, and React to develop the front-end features of the website, as well as Javascript/Typescript, Firebase, and Google Cloud for the back-end. My plan was to use Microsoft Azure to create an API key for the Queen's Microsoft authentication process, however, I found out while building my project that I required special permission from the Queen's IT Team to retrieve this key. At the moment, i'm using Google Authentication as a substitute so I can showcase the features of my website.

## On the sign in page, users will be asked to log in with either a Microsoft or Google account. 

## <img width="1470" alt="Image" src="https://github.com/user-attachments/assets/c1c02bc9-d7a9-4a13-9bc1-5f61acfd45e4" />

## If successful, they will be redirected to the dashboard where they will be able to view their meal balance, purchase requests, and option to sell/purchase TAMS. Additionally, users will have a mailbox icon on their dashboard that provides them with notifications on their listings and purchase requests.

## <img width="1470" alt="Image" src="https://github.com/user-attachments/assets/056bfb90-c651-4179-bba4-2173daa11ae8" />

## <img width="1467" alt="Image" src="https://github.com/user-attachments/assets/78f67804-0e10-4fdc-83e5-2d4759b88e5d" />

## If the user chooses to sell their TAMS, they will be redirected to another page where they can select the number of TAMS they want to sell, and the price-per-TAM they'd like to sell for. I've capped this number at $7.5 per TAM, as I want to keep it affordable for students who are struggling with financial insecurity. From there, the user can post a listing.

## <img width="1468" alt="Image" src="https://github.com/user-attachments/assets/2327cb32-8201-49e7-9174-3ad496e861e2" />

## <img width="1469" alt="Image" src="https://github.com/user-attachments/assets/7093ebc2-b596-4a24-845f-7d58cc1db877" />

## If the user chooses to purchase TAMS or view the available listings, they will be redirected to a dashboard with all of the listings. This information will contain the email of the user, how many TAMS they are selling, and the amount. Users can request to purchase these listings, and the seller has 24 hours to approve the request before it expires. Users who post a listing can also go to the dashboard to delete it if they change their mind.

## <img width="1468" alt="Image" src="https://github.com/user-attachments/assets/0d0b67ea-bfb8-44e4-9f23-fe163299005a" />

## Once a purchase request is accepted or denied, the person who requested it will recieve a notfication in their mailbox. If accepted, they will have 24 hours to purchase the TAMS before the request expires, and will be directed to a Stripe payment method page.

## <img width="1469" alt="Image" src="https://github.com/user-attachments/assets/95308080-857d-4346-a197-e7ece707690c" />


