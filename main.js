// قائمة التصنيفات مع الأيقونات - معدلة لتونس
const categories = [
    { id: 'all', name: 'الكل', icon: 'fa-solid fa-grid-2', color: '#e70013' },
    { id: 'vehicles', name: 'سيارات وفيات', icon: 'fa-solid fa-car', color: '#ff4444' },
    { id: 'realestate', name: 'عقارات', icon: 'fa-solid fa-building', color: '#ff8c42' },
    { id: 'electronics', name: 'إلكترونيات', icon: 'fa-solid fa-mobile-screen', color: '#4caf50' },
    { id: 'fashion', name: 'ملابس وأزياء', icon: 'fa-solid fa-shirt', color: '#9c27b0' },
    { id: 'beauty', name: 'تجميل وعطور', icon: 'fa-solid fa-spray-can-sparkles', color: '#e83e8c' },
    { id: 'furniture', name: 'أثاث ومنزل', icon: 'fa-solid fa-couch', color: '#795548' },
    { id: 'books', name: 'كتب وقرطاسية', icon: 'fa-solid fa-book', color: '#3f51b5' },
    { id: 'sports', name: 'رياضة', icon: 'fa-solid fa-futbol', color: '#ff9800' },
    { id: 'pets', name: 'حيوانات أليفة', icon: 'fa-solid fa-dog', color: '#009688' },
    { id: 'jobs', name: 'وظائف', icon: 'fa-solid fa-briefcase', color: '#607d8b' },
    { id: 'services', name: 'خدمات', icon: 'fa-solid fa-hand-sparkles', color: '#673ab7' },
    { id: 'babies', name: 'أطفال', icon: 'fa-solid fa-baby', color: '#ff69b4' },
    { id: 'tools', name: 'أدوات', icon: 'fa-solid fa-toolbox', color: '#795548' },
    { id: 'food', name: 'مواد غذائية', icon: 'fa-solid fa-utensils', color: '#ff5722' },
    { id: 'handmade', name: 'صناعات تقليدية', icon: 'fa-solid fa-hands', color: '#e70013' },
    { id: 'other', name: 'أخرى', icon: 'fa-solid fa-ellipsis', color: '#6c757d' }
];

// قائمة الولايات التونسية
const tunisianGovernorates = [
    "تونس", "صفاقس", "سوسة", "القيروان", "بنزرت", "نابل", "قابس", "مدنين",
    "قفصة", "المنستير", "أريانة", "بن عروس", "منوبة", "المهدية", "سليانة",
    "باجة", "جندوبة", "الكاف", "تطاوين", "قبلي", "توزر", "زغوان"
];

// المتغيرات العامة
let products = [];
let currentProductId = null;
let currentCategory = 'all';
let productToDelete = null;
let currentImages = [];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeCategories();
    loadProducts();
    setupEventListeners();
    updateProductsCount();
    addSampleProducts(); // إضافة منتجات تجريبية تونسية
});

// تهيئة التصنيفات
function initializeCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card ${cat.id === currentCategory ? 'active' : ''}" 
             onclick="filterByCategory('${cat.id}')"
             style="border-color: ${cat.color}">
            <i class="fas ${cat.icon}" style="color: ${cat.color}"></i>
            <span>${cat.name}</span>
            <span class="category-count" id="count-${cat.id}">0</span>
        </div>
    `).join('');

    // إضافة التصنيفات للقائمة المنسدلة
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">إختار التصنيف</option>' + 
        categories.filter(c => c.id !== 'all').map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    const form = document.getElementById('productForm');
    const imagesInput = document.getElementById('productImages');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const closeBtn = document.querySelector('.close');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    form.addEventListener('submit', handleFormSubmit);
    imagesInput.addEventListener('change', handleImagePreview);
    searchInput.addEventListener('input', filterProducts);
    sortSelect.addEventListener('change', sortProducts);
    toggleFormBtn.addEventListener('click', toggleForm);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', () => {
        document.getElementById('deleteConfirmModal').style.display = 'none';
        productToDelete = null;
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            productToDelete = null;
        }
    });
}

// تبديل ظهور نموذج الإضافة
function toggleForm() {
    const formSection = document.getElementById('addProductSection');
    const btn = document.getElementById('toggleFormBtn');
    
    if (formSection.classList.contains('show')) {
        formSection.classList.remove('show');
        btn.innerHTML = '<i class="fas fa-plus"></i> إضافة منتج جديد';
    } else {
        formSection.classList.add('show');
        btn.innerHTML = '<i class="fas fa-times"></i> إغلاق';
    }
}

// معاينة الصور قبل الرفع
function handleImagePreview(e) {
    const files = Array.from(e.target.files);
    currentImages = [];
    
    const previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = '';

    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImages.push(event.target.result);
                
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${event.target.result}" alt="معاينة ${index + 1}">
                    <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

// إزالة صورة من المعاينة
window.removeImage = function(index) {
    currentImages.splice(index, 1);
    const previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = '';
    
    currentImages.forEach((img, i) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${img}" alt="معاينة ${i + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${i})">×</button>
        `;
        previewContainer.appendChild(preview);
    });
};

// معالجة تقديم النموذج
function handleFormSubmit(e) {
    e.preventDefault();

    if (currentImages.length === 0) {
        alert('الرجاء إختيار صورة واحدة على الأقل');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        currency: document.getElementById('productCurrency').value,
        condition: document.getElementById('productCondition').value,
        location: document.getElementById('productLocation').value,
        images: currentImages,
        sellerName: document.getElementById('sellerName').value,
        sellerPhone: document.getElementById('sellerPhone').value,
        dateAdded: new Date().toISOString(),
        comments: []
    };

    products.unshift(newProduct);
    saveProducts();
    
    // إعادة تعيين النموذج
    resetForm();
    
    // إغلاق نموذج الإضافة
    document.getElementById('addProductSection').classList.remove('show');
    document.getElementById('toggleFormBtn').innerHTML = '<i class="fas fa-plus"></i> إضافة منتج جديد';
    
    // تحديث العرض
    filterByCategory(currentCategory);
    showNotification('تم إضافة المنتج بنجاح!', 'success');
}

// إعادة تعيين النموذج
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('imagePreviewContainer').innerHTML = '';
    currentImages = [];
}

// تحميل المنتجات من localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        // التأكد من وجود مصفوفة تعليقات لكل منتج
        products.forEach(p => {
            if (!p.comments) p.comments = [];
        });
    }
    displayProducts(products);
    updateCategoryCounts();
}

// حفظ المنتجات في localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// تصفية حسب التصنيف
window.filterByCategory = function(categoryId) {
    currentCategory = categoryId;
    
    // تحديث التصنيف النشط
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // تحديث العنوان
    const categoryName = categories.find(c => c.id === categoryId)?.name || 'الكل';
    document.getElementById('currentCategoryTitle').textContent = categoryName;
    
    // تصفية وعرض المنتجات
    filterProducts();
};

// تصفية المنتجات حسب البحث والتصنيف
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = products;
    
    // تصفية حسب التصنيف
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // تصفية حسب البحث
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.sellerName.toLowerCase().includes(searchTerm) ||
            p.location.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
    updateProductsCount(filtered.length);
}

// ترتيب المنتجات
function sortProducts() {
    const sortBy = document.getElementById('sortSelect').value;
    let sorted = [...products];
    
    // تطبيق التصنيف الحالي أولاً
    if (currentCategory !== 'all') {
        sorted = sorted.filter(p => p.category === currentCategory);
    }
    
    // تطبيق البحث
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        sorted = sorted.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // تطبيق الترتيب
    switch(sortBy) {
        case 'priceAsc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'priceDesc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        default:
            sorted.sort((a, b) => b.id - a.id);
    }
    
    displayProducts(sorted);
    updateProductsCount(sorted.length);
}

// عرض المنتجات
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-products">ما توجدش منتجات في هذا التصنيف</div>';
        return;
    }

    container.innerHTML = productsToShow.map(product => {
        const category = categories.find(c => c.id === product.category) || categories[categories.length - 1];
        const commentsCount = product.comments?.length || 0;
        
        return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <span class="product-badge">${product.condition}</span>
            <button class="delete-btn" onclick="deleteProduct(${product.id}, event)">×</button>
            <div class="product-images-slider">
                <img src="${product.images[0]}" alt="${product.name}" class="slider-image">
            </div>
            <div class="product-info">
                <div class="product-category">
                    <i class="fas ${category.icon}" style="color: ${category.color}"></i>
                    <span>${category.name}</span>
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                <div class="product-price">${product.currency} ${product.price.toFixed(3)}</div>
                <div class="product-meta">
                    <span class="product-location">
                        <i class="fas fa-map-marker-alt"></i> ${product.location}
                    </span>
                    <span class="product-comments">
                        <i class="fas fa-comment"></i> ${commentsCount}
                    </span>
                </div>
            </div>
        </div>
    `}).join('');
}

// عرض تفاصيل المنتج
window.showProductDetails = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    const category = categories.find(c => c.id === product.category) || categories[categories.length - 1];
    
    // عرض صور المنتج
    const imagesHtml = product.images.map(img => 
        `<img src="${img}" alt="${product.name}" class="modal-product-image">`
    ).join('');

    modalContent.innerHTML = `
        <div class="modal-product-images">
            ${imagesHtml}
        </div>
        <h2 class="modal-product-name">${product.name}</h2>
        <p class="modal-product-description">${product.description}</p>
        <div class="modal-product-price">${product.currency} ${product.price.toFixed(3)}</div>
        
        <div class="modal-product-details-grid">
            <div class="detail-item">
                <i class="fas fa-tag"></i>
                <span><strong>التصنيف:</strong> ${category.name}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span><strong>الحالة:</strong> ${product.condition}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>الولاية:</strong> ${product.location}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span><strong>تاريخ الإضافة:</strong> ${new Date(product.dateAdded).toLocaleDateString('ar-TN')}</span>
            </div>
        </div>
        
        <div class="modal-product-details-grid">
            <div class="detail-item">
                <i class="fas fa-user"></i>
                <span><strong>البائع:</strong> ${product.sellerName}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span><strong>للتواصل:</strong> ${product.sellerPhone}</span>
            </div>
        </div>
    `;

    // عرض التعليقات
    displayComments(product.comments || []);
    
    modal.style.display = 'block';
};

// عرض التعليقات
function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    
    if (!comments || comments.length === 0) {
        container.innerHTML = '<p class="no-comments">ما توجدش تعليقات بعد. كن أول من يعلق!</p>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-name">
                    <i class="fas fa-user-circle"></i> ${comment.name}
                </span>
                <span class="comment-date">${new Date(comment.date).toLocaleDateString('ar-TN')}</span>
            </div>
            ${comment.phone ? `<div class="comment-phone"><i class="fas fa-phone"></i> ${comment.phone}</div>` : ''}
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <button class="reply-btn" onclick="showReplyForm(${comment.id})">
                    <i class="fas fa-reply"></i> رد
                </button>
            </div>
            ${comment.replies ? comment.replies.map(reply => `
                <div class="reply-item">
                    <div class="comment-header">
                        <span class="comment-name">
                            <i class="fas fa-user-circle"></i> ${reply.name}
                        </span>
                        <span class="comment-date">${new Date(reply.date).toLocaleDateString('ar-TN')}</span>
                    </div>
                    <div class="comment-text">${reply.text}</div>
                </div>
            `).join('') : ''}
            <div id="replyForm-${comment.id}" class="reply-form" style="display: none;">
                <input type="text" id="replyName-${comment.id}" placeholder="إسمك" class="comment-input">
                <textarea id="replyText-${comment.id}" placeholder="أكتب ردك..." rows="2"></textarea>
                <button class="btn-submit-comment" onclick="submitReply(${comment.id})">
                    <i class="fas fa-paper-plane"></i> إرسال الرد
                </button>
            </div>
        </div>
    `).join('');
}

// إضافة تعليق جديد
window.addComment = function() {
    const name = document.getElementById('commenterName').value;
    const phone = document.getElementById('commenterPhone').value;
    const text = document.getElementById('commentText').value;
    
    if (!name || !text) {
        alert('الرجاء إدخال الإسم والتعليق');
        return;
    }
    
    const product = products.find(p => p.id === currentProductId);
    if (!product) return;
    
    if (!product.comments) {
        product.comments = [];
    }
    
    const newComment = {
        id: Date.now(),
        name: name,
        phone: phone,
        text: text,
        date: new Date().toISOString(),
        replies: []
    };
    
    product.comments.push(newComment);
    saveProducts();
    
    // إعادة تحميل التعليقات
    displayComments(product.comments);
    
    // تفريغ النموذج
    document.getElementById('commenterName').value = '';
    document.getElementById('commenterPhone').value = '';
    document.getElementById('commentText').value = '';
    
    showNotification('تم إضافة تعليقك بنجاح', 'success');
};

// إظهار نموذج الرد
window.showReplyForm = function(commentId) {
    const form = document.getElementById(`replyForm-${commentId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

// إرسال رد
window.submitReply = function(commentId) {
    const name = document.getElementById(`replyName-${commentId}`).value;
    const text = document.getElementById(`replyText-${commentId}`).value;
    
    if (!name || !text) {
        alert('الرجاء إدخال الإسم والرد');
        return;
    }
    
    const product = products.find(p => p.id === currentProductId);
    if (!product) return;
    
    const comment = product.comments.find(c => c.id === commentId);
    if (!comment) return;
    
    if (!comment.replies) {
        comment.replies = [];
    }
    
    comment.replies.push({
        name: name,
        text: text,
        date: new Date().toISOString()
    });
    
    saveProducts();
    
    // إعادة تحميل التعليقات
    displayComments(product.comments);
    
    // إخفاء نموذج الرد
    document.getElementById(`replyForm-${commentId}`).style.display = 'none';
    
    showNotification('تم إضافة ردك بنجاح', 'success');
};

// حذف المنتج
window.deleteProduct = function(productId, event) {
    event.stopPropagation();
    productToDelete = productId;
    document.getElementById('deleteConfirmModal').style.display = 'block';
};

// تأكيد الحذف
function confirmDelete() {
    if (productToDelete) {
        products = products.filter(p => p.id !== productToDelete);
        saveProducts();
        filterByCategory(currentCategory);
        updateCategoryCounts();
        document.getElementById('deleteConfirmModal').style.display = 'none';
        productToDelete = null;
        showNotification('تم حذف المنتج بنجاح', 'success');
    }
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// تحديث عدد المنتجات
function updateProductsCount(count) {
    const countElement = document.getElementById('productsCount');
    if (count !== undefined) {
        countElement.textContent = `${count} منتج`;
    } else {
        countElement.textContent = `${products.length} منتج`;
    }
}

// تحديث أعداد التصنيفات
function updateCategoryCounts() {
    categories.forEach(cat => {
        const count = cat.id === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat.id).length;
        
        const countElement = document.getElementById(`count-${cat.id}`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// إظهار إشعار
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#42b72a' : '#dc3545'};
        color: white;
        padding: 12px 25px;
        border-radius: 50px;
        z-index: 2000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// إضافة منتجات تجريبية تونسية
function addSampleProducts() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: 1,
                name: "تويوتا كورولا 2019",
                category: "vehicles",
                description: "سيارة تويوتا كورولا موديل 2019، ماشية 60 ألف كم، مكيفة، بنزين، صيانة دورية",
                price: 45000,
                currency: "د.ت",
                condition: "مستعمل - ممتاز",
                location: "تونس",
                images: ["https://via.placeholder.com/300x200/ff4444/ffffff?text=Toyota+Corolla"],
                sellerName: "محمد العياري",
                sellerPhone: "20123456",
                dateAdded: new Date().toISOString(),
                comments: []
            },
            {
                id: 2,
                name: "شقة للبيع بالمنار",
                category: "realestate",
                description: "شقة 3 غرف نوم + صالة + مطبخ + حمامين، مساحة 120م، تشطيب حديث، قريب من كل الخدمات",
                price: 280000,
                currency: "د.ت",
                condition: "جديد",
                location: "تونس",
                images: ["https://via.placeholder.com/300x200/ff8c42/ffffff?text=Appartement"],
                sellerName: "سارة بن محمود",
                sellerPhone: "98765432",
                dateAdded: new Date().toISOString(),
                comments: []
            },
            {
                id: 3,
                name: "آيفون 13 برو",
                category: "electronics",
                description: "آيفون 13 برو 256 جيجا، لون أزرق، مع الضمان، بطارية 95%",
                price: 3200,
                currency: "د.ت",
                condition: "مستعمل - ممتاز",
                location: "صفاقس",
                images: ["https://via.placeholder.com/300x200/4caf50/ffffff?text=iPhone+13"],
                sellerName: "علي الجلاصي",
                sellerPhone: "55443322",
                dateAdded: new Date().toISOString(),
                comments: []
            },
            {
                id: 4,
                name: "فستان تقليدي تونسي",
                category: "fashion",
                description: "فستان تقليدي تونسي مطرز يدوياً، مقاس M، مناسب للخطوبة والأفراح",
                price: 450,
                currency: "د.ت",
                condition: "جديد",
                location: "القيروان",
                images: ["https://via.placeholder.com/300x200/9c27b0/ffffff?text=Ften+Ta9lidi"],
                sellerName: "فاطمة المحمدي",
                sellerPhone: "22334455",
                dateAdded: new Date().toISOString(),
                comments: []
            },
            {
                id: 5,
                name: "سكوتر كهربائي",
                category: "vehicles",
                description: "سكوتر كهربائي، بطارية تدوم 40 كم، سرعة قصوى 25 كم/س، بحالة جيدة",
                price: 1200,
                currency: "د.ت",
                condition: "مستعمل - جيد",
                location: "سوسة",
                images: ["https://via.placeholder.com/300x200/ff9800/ffffff?text=Scooter"],
                sellerName: "أمين الجلاصي",
                sellerPhone: "66778899",
                dateAdded: new Date().toISOString(),
                comments: []
            },
            {
                id: 6,
                name: "طقم صوف تقليدي",
                category: "handmade",
                description: "طقم صوف تقليدي تونسي أصلي، صناعة يدوية، مكون من كرسي وفرشة",
                price: 650,
                currency: "د.ت",
                condition: "جديد",
                location: "القيروان",
                images: ["https://via.placeholder.com/300x200/e70013/ffffff?text=Souf+Ta9lidi"],
                sellerName: "خديجة المرزوقي",
                sellerPhone: "11223344",
                dateAdded: new Date().toISOString(),
                comments: []
            }
        ];

        products = sampleProducts;
        saveProducts();
        displayProducts(products);
        updateCategoryCounts();
    }
}