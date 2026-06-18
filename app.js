import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmSuEVNMP_BW15OhouY7tVHz97FUw3lSI",
  authDomain: "connect-hrs.firebaseapp.com",
  projectId: "connect-hrs",
  storageBucket: "connect-hrs.firebasestorage.app",
  messagingSenderId: "782760667457",
  appId: "1:782760667457:web:fda1bb1c6c805b92ca59c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const userEmailSpan = document.getElementById('user-email');
  const authError = document.getElementById('auth-error');

  const companyList = document.getElementById('company-list');
  const filterRegion = document.getElementById('filter-region');
  const filterCategory = document.getElementById('filter-category');

  const crmForm = document.getElementById('crm-form');
  const formCompanyName = document.getElementById('form-company-name');
  const formContactName = document.getElementById('form-contact-name');
  const formEmail = document.getElementById('form-email');
  const formLinkedin = document.getElementById('form-linkedin-url');
  const formStatus = document.getElementById('form-status');
  const formNotes = document.getElementById('form-notes');
  const btnSaveContact = document.getElementById('btn-save-contact');
  const crmError = document.getElementById('crm-error');
  const contactsList = document.getElementById('contacts-list');
  const filterCrmStatus = document.getElementById('filter-crm-status');
  const btnExportCsv = document.getElementById('btn-export-csv');

  let contacts = [];
  let unsubscribeContacts = null;

  // 1. Target Companies Data
  const predefinedCompanies = [
    // Quant & High-Frequency Trading (HFT)
    { id: 1, name: "Jane Street", category: "Quant", region: "Global" },
    { id: 2, name: "Tower Research Capital", category: "Quant", region: "Global" },
    { id: 3, name: "Optiver", category: "Quant", region: "Global" },
    { id: 4, name: "Graviton Research", category: "Quant", region: "India" },
    { id: 5, name: "Quadeye", category: "Quant", region: "India" },
    { id: 6, name: "AlphaGrep", category: "Quant", region: "India" },
    { id: 7, name: "WorldQuant", category: "Quant", region: "Global" },
    { id: 8, name: "Trexquant", category: "Quant", region: "Global" },
    { id: 9, name: "Hudson River Trading (HRT)", category: "Quant", region: "Global" },
    { id: 10, name: "D.E. Shaw", category: "Quant", region: "Global" },
    { id: 11, name: "Two Sigma", category: "Quant", region: "Global" },
    { id: 12, name: "Citadel", category: "Quant", region: "Global" },
    { id: 13, name: "APT Portfolio", category: "Quant", region: "India" },
    { id: 14, name: "NK Securities", category: "Quant", region: "India" },

    // Big Tech & Unicorns
    { id: 15, name: "Google", category: "Big Tech", region: "Global" },
    { id: 16, name: "Microsoft", category: "Big Tech", region: "Global" },
    { id: 17, name: "Amazon", category: "Big Tech", region: "Global" },
    { id: 18, name: "Apple", category: "Big Tech", region: "Global" },
    { id: 19, name: "Meta", category: "Big Tech", region: "Global" },
    { id: 20, name: "Uber", category: "Big Tech", region: "Global" },
    { id: 21, name: "Atlassian", category: "Big Tech", region: "Global" },
    { id: 22, name: "Rubrik", category: "Big Tech", region: "Global" },
    { id: 23, name: "Sprinklr", category: "Big Tech", region: "India" },
    { id: 24, name: "Arcesium", category: "Big Tech", region: "India" },
    { id: 25, name: "Cisco", category: "Big Tech", region: "Global" },
    { id: 26, name: "Adobe", category: "Big Tech", region: "Global" },
    { id: 27, name: "Salesforce", category: "Big Tech", region: "Global" },
    { id: 28, name: "Intuit", category: "Big Tech", region: "Global" },
    { id: 29, name: "LinkedIn", category: "Big Tech", region: "Global" },
    { id: 30, name: "NVIDIA", category: "Big Tech", region: "Global" },
    { id: 31, name: "Databricks", category: "Big Tech", region: "Global" },
    { id: 32, name: "Snowflake", category: "Big Tech", region: "Global" },

    // Indian Startups & Tech Giants
    { id: 33, name: "Flipkart", category: "Big Tech", region: "India" },
    { id: 34, name: "Swiggy", category: "Big Tech", region: "India" },
    { id: 35, name: "Zomato", category: "Big Tech", region: "India" },
    { id: 36, name: "Ola", category: "Big Tech", region: "India" },
    { id: 37, name: "Dream11", category: "Big Tech", region: "India" },
    { id: 38, name: "ShareChat", category: "Big Tech", region: "India" },
    { id: 39, name: "Meesho", category: "Big Tech", region: "India" },
    { id: 40, name: "Postman", category: "Big Tech", region: "India" },
    { id: 41, name: "BrowserStack", category: "Big Tech", region: "India" },

    // Fintech & Investment Banks
    { id: 42, name: "Goldman Sachs", category: "Fintech", region: "Global" },
    { id: 43, name: "Morgan Stanley", category: "Fintech", region: "Global" },
    { id: 44, name: "J.P. Morgan", category: "Fintech", region: "Global" },
    { id: 45, name: "Barclays", category: "Fintech", region: "Global" },
    { id: 46, name: "BNY Mellon", category: "Fintech", region: "Global" },
    { id: 47, name: "American Express", category: "Fintech", region: "Global" },
    { id: 48, name: "Wells Fargo", category: "Fintech", region: "Global" },
    { id: 49, name: "Razorpay", category: "Fintech", region: "India" },
    { id: 50, name: "PhonePe", category: "Fintech", region: "India" },
    { id: 51, name: "CRED", category: "Fintech", region: "India" },
    { id: 52, name: "Groww", category: "Fintech", region: "India" },
    { id: 53, name: "Zerodha", category: "Fintech", region: "India" },
    { id: 54, name: "Navi", category: "Fintech", region: "India" },

    // Data Analytics & Consulting
    { id: 55, name: "LatentView Analytics", category: "Services", region: "India" },
    { id: 56, name: "Fractal Analytics", category: "Services", region: "India" },
    { id: 57, name: "Mu Sigma", category: "Services", region: "India" },
    { id: 58, name: "ZS Associates", category: "Services", region: "Global" },
    { id: 59, name: "Tiger Analytics", category: "Services", region: "India" },
    { id: 60, name: "McKinsey & Co.", category: "Services", region: "Global" },
    { id: 61, name: "BCG", category: "Services", region: "Global" },
    { id: 62, name: "Bain & Co.", category: "Services", region: "Global" },
    { id: 63, name: "PwC", category: "Services", region: "Global" },
    { id: 64, name: "Deloitte", category: "Services", region: "Global" },
    { id: 65, name: "EY", category: "Services", region: "Global" },
    { id: 66, name: "KPMG", category: "Services", region: "Global" },
    { id: 67, name: "WWT", category: "Services", region: "Global" },
    { id: 68, name: "Accenture Japan", category: "Services", region: "Global" },
    { id: 69, name: "FN MathLogic", category: "Services", region: "India" },

    // Additional User Requested & Related
    { id: 70, name: "Samsung", category: "Big Tech", region: "Global" },
    { id: 71, name: "Warner Bros", category: "Big Tech", region: "Global" },
    { id: 72, name: "Disney", category: "Big Tech", region: "Global" },
    { id: 73, name: "Oracle", category: "Big Tech", region: "Global" },
    { id: 74, name: "Unify", category: "Big Tech", region: "Global" },
    { id: 75, name: "Zinnia", category: "Big Tech", region: "Global" },
    { id: 76, name: "APPSIAN", category: "Big Tech", region: "Global" },
    { id: 77, name: "Milk (Tech Japan)", category: "Big Tech", region: "Global" },
    { id: 78, name: "Insurity", category: "Fintech", region: "Global" },
    { id: 79, name: "Deutsche Bank", category: "Fintech", region: "Global" },
    { id: 80, name: "Squarepoint Capital", category: "Quant", region: "Global" },
    { id: 81, name: "PayU", category: "Fintech", region: "India" },
    { id: 82, name: "Snapmint", category: "Fintech", region: "India" },
    { id: 83, name: "Inito", category: "Big Tech", region: "India" },
    { id: 84, name: "CityMall", category: "Big Tech", region: "India" },
    { id: 85, name: "Bloomberg", category: "Big Tech", region: "Global" },
    { id: 86, name: "MathWorks", category: "Big Tech", region: "Global" },
    { id: 87, name: "Cvent", category: "Big Tech", region: "India" },
    
    // Batch 3: Additional Services, FMCG & Auto
    { id: 88, name: "Capgemini", category: "Services", region: "Global" },
    { id: 89, name: "Tata Motors", category: "Services", region: "India" },
    { id: 90, name: "Nestle", category: "Services", region: "Global" },
    { id: 91, name: "Unilever", category: "Services", region: "Global" },
    { id: 92, name: "Accenture", category: "Services", region: "Global" },
    { id: 93, name: "Mphasis", category: "Services", region: "Global" },
    { id: 94, name: "Cognifyz Technologies", category: "Services", region: "India" },
    { id: 95, name: "Infosys", category: "Services", region: "India" },
    { id: 96, name: "Myntra", category: "Big Tech", region: "India" },
    { id: 97, name: "HCLTech", category: "Services", region: "India" },
    { id: 98, name: "Amazon Web Services (AWS)", category: "Big Tech", region: "Global" },
    { id: 99, name: "Blinkit", category: "Big Tech", region: "India" },
    { id: 100, name: "IBM", category: "Big Tech", region: "Global" },
    { id: 101, name: "Tech Mahindra", category: "Services", region: "India" },
    { id: 102, name: "Tata Technologies", category: "Services", region: "India" }
  ];

  // 2. Auth Logic
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authSection.style.display = 'none';
      appSection.style.display = 'block';
      userEmailSpan.textContent = user.email;
      loadCompanies();
      subscribeToContacts();
    } else {
      authSection.style.display = 'flex';
      appSection.style.display = 'none';
      if (unsubscribeContacts) unsubscribeContacts();
    }
  });

  btnLogin.addEventListener('click', async () => {
    try {
      authError.style.display = 'none';
      btnLogin.disabled = true;
      btnLogin.textContent = 'Signing in...';
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      authError.textContent = "Login failed: " + error.message;
      authError.style.display = 'block';
      btnLogin.disabled = false;
      btnLogin.innerHTML = 'Sign in with Google';
    }
  });

  btnLogout.addEventListener('click', () => {
    signOut(auth);
  });

  // 3. Search URLs & Email Generator
  function generateSearchUrls(company) {
    const keywords = '("campus recruiter" OR "talent acquisition")';
    let q = company.name + ' ' + keywords;
    if (company.region && company.region !== 'Global') q += ' ' + company.region;
    const enc = encodeURIComponent(q);
    return {
      google: `https://www.google.com/search?q=${enc}`,
      linkedin: `https://www.linkedin.com/search/results/people/?keywords=${enc}`
    };
  }

  function generateEmailLink(contact) {
    if (!contact.email) return '';
    const subject = encodeURIComponent("Hiring NIT Mizoram Mathematics & Computing Graduates");
    const body = encodeURIComponent(`Hi ${contact.contact_name},\n\nI am reaching out from the Placement Cell of NIT Mizoram. We are the first batch of Mathematics and Computing graduates, equipped with strong analytical and programming skills tailored for roles at ${contact.company_name}.\n\nWe would love to discuss potential placement or internship opportunities.\n\nBest regards,\n[Your Name]`);
    return `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  // 4. Render Predefined Companies
  function loadCompanies() {
    renderCompanies();
  }

  function renderCompanies() {
    companyList.innerHTML = '';
    const actReg = filterRegion.value;
    const actCat = filterCategory.value;

    const filtered = predefinedCompanies.filter(c => {
      const rm = actReg === 'All' || c.region === actReg;
      const cm = actCat === 'All' || c.category === actCat;
      return rm && cm;
    });

    filtered.forEach(company => {
      const card = document.createElement('div');
      card.className = 'company-card';
      const urls = generateSearchUrls(company);

      card.innerHTML = `
        <h3>${escapeHtml(company.name)}</h3>
        <p><strong>Category:</strong> ${escapeHtml(company.category)}</p>
        <p><strong>Region:</strong> ${escapeHtml(company.region)}</p>
        <button class="btn-search-google" onclick="window.open('${urls.google}')">Google</button>
        <button class="btn-search-linkedin" onclick="window.open('${urls.linkedin}')">LinkedIn</button>
      `;
      companyList.appendChild(card);
    });
  }

  // 5. Firebase Firestore CRUD
  function subscribeToContacts() {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    unsubscribeContacts = onSnapshot(q, (snapshot) => {
      contacts = [];
      snapshot.forEach((doc) => {
        contacts.push({ id: doc.id, ...doc.data() });
      });
      renderContacts();
    });
  }

  function renderContacts() {
    contactsList.innerHTML = '';
    const activeFilter = filterCrmStatus.value;
    
    const filtered = contacts.filter(c => activeFilter === 'All' || c.status === activeFilter);
    
    if (filtered.length === 0) {
      contactsList.innerHTML = '<tr><td colspan="7" class="loading-text">No contacts found.</td></tr>';
      return;
    }

    filtered.forEach(contact => {
      const row = document.createElement('tr');
      row.className = 'contact-row';
      
      const emailCell = contact.email ? `<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a><br><a href="${generateEmailLink(contact)}" class="btn-email">Draft Pitch</a>` : '';
      const linkedinCell = contact.linkedin_url ? `<a href="${escapeHtml(contact.linkedin_url)}" target="_blank">View Profile</a>` : '';

      row.innerHTML = `
        <td>${escapeHtml(contact.company_name)}</td>
        <td>${escapeHtml(contact.contact_name)}</td>
        <td>${emailCell}</td>
        <td>${linkedinCell}</td>
        <td class="notes-cell">${escapeHtml(contact.notes || '')}</td>
        <td>
          <select class="crm-status-select" data-id="${contact.id}">
            <option value="To Contact" ${contact.status === 'To Contact' ? 'selected' : ''}>To Contact</option>
            <option value="Emailed" ${contact.status === 'Emailed' ? 'selected' : ''}>Emailed</option>
            <option value="Meeting Scheduled" ${contact.status === 'Meeting Scheduled' ? 'selected' : ''}>Meeting Scheduled</option>
          </select>
        </td>
        <td>
          <button class="btn-delete-contact" data-id="${contact.id}">Delete</button>
        </td>
      `;

      // Status Change Listener
      row.querySelector('.crm-status-select').addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        const contactRef = doc(db, "contacts", contact.id);
        try {
          await updateDoc(contactRef, { status: newStatus });
        } catch (err) {
          console.error("Error updating status: ", err);
          e.target.value = contact.status; // Revert
        }
      });

      // Delete Listener
      row.querySelector('.btn-delete-contact').addEventListener('click', async () => {
        if(confirm("Delete this contact?")) {
          try {
            await deleteDoc(doc(db, "contacts", contact.id));
          } catch (err) {
            console.error("Error deleting contact: ", err);
          }
        }
      });

      contactsList.appendChild(row);
    });
  }

  // 6. Form Submission
  crmForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!crmForm.checkValidity()) return;

    btnSaveContact.disabled = true;
    btnSaveContact.textContent = 'Saving...';
    crmError.style.display = 'none';

    try {
      await addDoc(collection(db, "contacts"), {
        company_name: formCompanyName.value,
        contact_name: formContactName.value,
        email: formEmail.value || null,
        linkedin_url: formLinkedin.value || null,
        status: formStatus.value,
        notes: formNotes.value || '',
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.email
      });
      crmForm.reset();
    } catch (err) {
      console.error(err);
      crmError.textContent = "Error saving: " + err.message;
      crmError.style.display = 'block';
    } finally {
      btnSaveContact.disabled = false;
      btnSaveContact.textContent = 'Save Contact';
    }
  });

  // 7. CSV Export
  btnExportCsv.addEventListener('click', () => {
    if (contacts.length === 0) return alert("No contacts to export");
    
    const headers = ["Company", "Name", "Email", "LinkedIn", "Status", "Notes"];
    const rows = contacts.map(c => [
      c.company_name, 
      c.contact_name, 
      c.email || '', 
      c.linkedin_url || '', 
      c.status, 
      (c.notes || '').replace(/\n/g, ' ')
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(field => `"${field}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "placement_contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Utilities
  filterRegion.addEventListener('change', renderCompanies);
  filterCategory.addEventListener('change', renderCompanies);
  filterCrmStatus.addEventListener('change', renderContacts);

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
});
