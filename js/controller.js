
// ==================== CONTROLLER ====================
export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.otp = '';
        
        this.initializeEventListeners();
        this.checkLoginStatus();
    }
    
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.handleNavigation(page);
            });
        });
        
        // OTP Login
        document.getElementById('loginAsFanBtn').addEventListener('click', () => this.handleLogin('fan'));
        document.getElementById('loginAsCreatorBtn').addEventListener('click', () => this.handleLogin('creator'));
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Creator detail
        document.getElementById('backToCreatorsBtn').addEventListener('click', () => this.view.showCreatorsList());
        document.getElementById('supportCreatorBtn').addEventListener('click', () => this.handleSupportCreator());
        
        // Payment modal
        document.getElementById('closePaymentModal').addEventListener('click', () => this.view.closePaymentModal());
        document.getElementById('cancelPaymentBtn').addEventListener('click', () => this.view.closePaymentModal());
        document.getElementById('processPaymentBtn').addEventListener('click', () => this.processPayment());
        
        // Dashboard
        document.getElementById('createPostBtn').addEventListener('click', () => this.createPost());
        document.getElementById('aiCaptionBtn').addEventListener('click', () => this.generateAICaption());
        document.getElementById('useAiCaptionBtn').addEventListener('click', () => this.useAICaption());
        
        // Creator cards click
        document.addEventListener('click', (e) => {
            const creatorCard = e.target.closest('.creator-card');
            if (creatorCard) {
                const creatorId = parseInt(creatorCard.dataset.creatorId);
                this.showCreatorDetail(creatorId);
            }
        });
    }
    
    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.model.setCurrentUser(user);
            this.showMainApp();
        } else {
            this.generateOTP();
            this.view.showOTPLogin();
        }
    }
    
    generateOTP() {
        this.otp = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('otpDisplay').textContent = this.otp;
        console.log(`OTP untuk login: ${this.otp}`);
    }
    
    handleLogin(role) {
        const otpInput = document.getElementById('otpInput').value;
        
        if (otpInput === this.otp) {
            // Select random user based on role
            const users = this.model.state.users.filter(u => u.role === role);
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            this.model.setCurrentUser(randomUser);
            this.view.showNotification(`Login berhasil! Selamat datang, ${randomUser.name}`, 'success');
            this.showMainApp();
        } else {
            this.view.showNotification('OTP salah. Silakan coba lagi.', 'danger');
        }
    }
    
    handleLogout() {
        this.model.logout();
        this.view.showNotification('Anda telah logout', 'info');
        this.generateOTP();
        this.view.showOTPLogin();
    }
    
    showMainApp() {
        this.view.showMainApp();
        this.view.updateNavbar(this.model.state.currentUser);
        
        if (this.model.state.currentUser.role === 'creator') {
            this.updateCreatorDashboard();
        }
        
        this.renderCreatorsList();
    }
    
    handleNavigation(page) {
        this.view.navigateToPage(page);
        this.model.state.currentView = page;
        
        if (page === 'dashboard' && this.model.state.currentUser.role === 'creator') {
            this.updateCreatorDashboard();
        }
    }
    
    renderCreatorsList() {
        this.view.renderCreatorsList(this.model.state.creators, this.model.state.balances);
    }
    
    showCreatorDetail(creatorId) {
        const creator = this.model.state.creators.find(c => c.id === creatorId);
        if (!creator) return;
        
        this.model.state.selectedCreator = creator;
        const stats = this.model.getCreatorStats(creatorId);
        
        this.view.showCreatorDetail(creator, stats);
        const posts = this.model.getCreatorPosts(creatorId);
        this.view.renderCreatorPosts(posts);
    }
    
    handleSupportCreator() {
        if (!this.model.state.currentUser) {
            this.view.showNotification('Silakan login terlebih dahulu', 'warning');
            return;
        }
        
        if (this.model.state.currentUser.role === 'creator') {
            this.view.showNotification('Creator tidak bisa memberikan saweria ke creator lain', 'warning');
            return;
        }
        
        this.view.showPaymentModal();
    }
    
    processPayment() {
        const amount = parseInt(document.getElementById('supportAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;
        const message = document.getElementById('supportMessage').value;
        
        if (!amount || amount <= 0) {
            this.view.showNotification('Masukkan jumlah saweria yang valid', 'warning');
            return;
        }
        
        this.view.showPaymentProcessing();
        
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;
            
            if (isSuccess) {
                const support = {
                    id: Date.now(),
                    fan_id: this.model.state.currentUser.id,
                    fan_name: this.model.state.currentUser.name,
                    creator_id: this.model.state.selectedCreator.id,
                    creator_name: this.model.state.selectedCreator.name,
                    amount: amount,
                    status: 'paid',
                    payment_method: paymentMethod,
                    message: message || 'Terima kasih atas karyanya!',
                    created_at: new Date().toISOString()
                };
                
                this.model.addSupport(support);
                this.view.showPaymentSuccess();
                
                setTimeout(() => {
                    this.view.closePaymentModal();
                    this.view.showNotification(`Saweria sebesar Rp ${amount.toLocaleString('id-ID')} berhasil dikirim ke ${this.model.state.selectedCreator.name}!`, 'success');
                    this.renderCreatorsList();
                    
                    // Simulate real-time notification
                    if (this.model.state.currentUser.id === this.model.state.selectedCreator.id) {
                        this.updateCreatorDashboard();
                    }
                }, 2000);
            } else {
                this.view.showPaymentFailed();
                setTimeout(() => {
                    this.view.closePaymentModal();
                    this.view.showNotification('Pembayaran gagal. Silakan coba lagi.', 'danger');
                }, 2000);
            }
        }, 2000);
    }
    
    createPost() {
        if (!this.model.state.currentUser || this.model.state.currentUser.role !== 'creator') {
            this.view.showNotification('Hanya creator yang bisa membuat postingan', 'warning');
            return;
        }
        
        const text = document.getElementById('postText').value;
        const mediaUrl = document.getElementById('postMedia').value;
        
        if (!text) {
            this.view.showNotification('Teks postingan tidak boleh kosong', 'warning');
            return;
        }
        
        const post = {
            id: Date.now(),
            creator_id: this.model.state.currentUser.id,
            text: text,
            media_url: mediaUrl || null,
            created_at: new Date().toISOString(),
            likes: 0,
            comments: 0
        };
        
        this.model.addPost(post);
        
        document.getElementById('postText').value = '';
        document.getElementById('postMedia').value = '';
        this.view.hideAICaption();
        
        this.view.showNotification('Postingan berhasil dibuat!', 'success');
        this.updateCreatorDashboard();
    }
    
    generateAICaption() {
        const aiCaptions = [
            "Terima kasih telah mendukung karya saya 💖",
            "Karya baru untuk kalian semua! Semoga suka 🎨",
            "Proses kreatif hari ini. Senang bisa berbagi dengan kalian ✨",
            "Inspirasi datang dari mana saja. Hari ini dari alam 🌿",
            "Karya ini saya dedikasikan untuk semua supporter setia saya 🙏",
            "Setiap goresan memiliki cerita. Apa cerita kalian hari ini? 📖",
            "Seni adalah cara saya berkomunikasi dengan dunia 🌍",
            "Terima kasih untuk semua dukungan yang luar biasa! 💪",
            "Karya ini adalah hasil dari mimpi dan kerja keras 💭",
            "Seni menghubungkan kita semua. Terima kasih sudah menjadi bagian dari perjalanan saya 🤝"
        ];
        
        const randomCaption = aiCaptions[Math.floor(Math.random() * aiCaptions.length)];
        this.view.showAICaption(randomCaption);
    }
    
    useAICaption() {
        const aiCaption = document.getElementById('aiCaptionText').textContent;
        document.getElementById('postText').value = aiCaption;
        this.view.showNotification('Caption AI telah digunakan', 'success');
    }
    
    updateCreatorDashboard() {
        const stats = this.model.getCreatorStats(this.model.state.currentUser.id);
        this.view.updateDashboard(this.model.state.currentUser, stats);
        
        const supports = this.model.getCreatorSupports(this.model.state.currentUser.id);
        this.view.renderSupportHistory(supports, true);
        
        this.view.renderAnalytics(supports);
    }
}