
// ==================== VIEW ====================
export class View {
    constructor() {
        this.elements = {
            otpContainer: document.getElementById('otpContainer'),
            mainContainer: document.getElementById('mainContainer'),
            creatorsPage: document.getElementById('creatorsPage'),
            dashboardPage: document.getElementById('dashboardPage'),
            creatorsList: document.getElementById('creatorsList'),
            creatorDetail: document.getElementById('creatorDetail'),
            creatorPosts: document.getElementById('creatorPosts'),
            supportHistory: document.getElementById('supportHistory'),
            paymentModal: document.getElementById('paymentModal'),
            notificationToast: document.getElementById('notificationToast'),
            toastMessage: document.getElementById('toastMessage')
        };
    }
    
    showOTPLogin() {
        this.elements.otpContainer.style.display = 'block';
        this.elements.mainContainer.style.display = 'none';
    }
    
    showMainApp() {
        this.elements.otpContainer.style.display = 'none';
        this.elements.mainContainer.style.display = 'block';
    }
    
    navigateToPage(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}Page`).classList.add('active');
    }
    
    renderCreatorsList(creators, balances) {
        this.elements.creatorsList.innerHTML = '';
        
        creators.forEach(creator => {
            const balance = balances[creator.id] || 0;
            const creatorCard = document.createElement('div');
            creatorCard.className = 'col-md-4';
            creatorCard.innerHTML = `
                <div class="creator-card card h-100" data-creator-id="${creator.id}">
                    <div class="card-body text-center">
                        <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar mb-3">
                        <h5>${creator.name}</h5>
                        <p class="text-muted small">${creator.bio}</p>
                        <div class="mb-2">
                            <span class="saweria-badge">Rp ${balance.toLocaleString('id-ID')}</span>
                        </div>
                        <button class="btn btn-outline-primary btn-sm">Lihat Profil</button>
                    </div>
                </div>
            `;
            
            this.elements.creatorsList.appendChild(creatorCard);
        });
    }
    
    showCreatorDetail(creator, stats) {
        this.elements.creatorsList.style.display = 'none';
        this.elements.creatorDetail.style.display = 'block';
        
        document.getElementById('detailCreatorAvatar').src = creator.avatar;
        document.getElementById('detailCreatorName').textContent = creator.name;
        document.getElementById('detailCreatorRole').textContent = creator.role;
        document.getElementById('detailCreatorPosts').textContent = stats.totalPosts;
        document.getElementById('detailCreatorSupporters').textContent = stats.totalSupporters;
    }
    
    showCreatorsList() {
        this.elements.creatorsList.style.display = 'flex';
        this.elements.creatorDetail.style.display = 'none';
    }
    
    renderCreatorPosts(posts) {
        this.elements.creatorPosts.innerHTML = '';
        
        if (posts.length === 0) {
            this.elements.creatorPosts.innerHTML = '<p class="text-muted">Belum ada postingan.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card card mb-3';
            
            let mediaContent = '';
            if (post.media_url) {
                mediaContent = `<img src="${post.media_url}" alt="Post media" class="post-image">`;
            }
            
            postCard.innerHTML = `
                ${mediaContent}
                <div class="card-body">
                    <p>${post.text}</p>
                    <div class="post-actions">
                        <button class="post-action-btn">
                            <i class="bi bi-heart"></i> ${post.likes}
                        </button>
                        <button class="post-action-btn">
                            <i class="bi bi-chat"></i> ${post.comments}
                        </button>
                        <button class="post-action-btn">
                            <i class="bi bi-share"></i> Bagikan
                        </button>
                    </div>
                    <small class="text-muted">${this.formatDate(post.created_at)}</small>
                </div>
            `;
            
            this.elements.creatorPosts.appendChild(postCard);
        });
    }
    
    renderSupportHistory(supports, isCreator) {
        this.elements.supportHistory.innerHTML = '';
        
        if (supports.length === 0) {
            this.elements.supportHistory.innerHTML = '<p class="text-muted">Belum ada riwayat saweria.</p>';
            return;
        }
        
        supports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        supports.forEach(support => {
            const historyItem = document.createElement('div');
            historyItem.className = 'support-history-item';
            
            let actionText = '';
            if (isCreator) {
                actionText = `
                    <strong>${support.fan_name}</strong> memberikan saweria 
                    <strong>Rp ${support.amount.toLocaleString('id-ID')}</strong>
                `;
                if (support.message) {
                    actionText += `<br><em>"${support.message}"</em>`;
                }
            } else {
                actionText = `Anda memberikan saweria <strong>Rp ${support.amount.toLocaleString('id-ID')}</strong> ke ${support.creator_name}`;
            }
            
            historyItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <p class="mb-1">${actionText}</p>
                        <small class="text-muted">
                            ${this.formatDate(support.created_at)} • ${support.payment_method}
                        </small>
                    </div>
                    <span class="badge bg-success">${support.status}</span>
                </div>
            `;
            
            this.elements.supportHistory.appendChild(historyItem);
        });
    }
    
    updateDashboard(user, stats) {
        document.getElementById('userBalance').textContent = stats.totalAmount.toLocaleString('id-ID');
        document.getElementById('totalSupporters').textContent = stats.totalSupporters;
        document.getElementById('totalPosts').textContent = stats.totalPosts;
        document.getElementById('avgSupport').textContent = 'Rp ' + Math.round(stats.avgSupport).toLocaleString('id-ID');
    }
    
    showPaymentModal() {
        this.elements.paymentModal.classList.add('active');
    }
    
    closePaymentModal() {
        this.elements.paymentModal.classList.remove('active');
        document.getElementById('paymentLoading').classList.remove('active');
        document.getElementById('paymentSuccess').style.display = 'none';
        document.getElementById('paymentFailed').style.display = 'none';
    }
    
    showPaymentProcessing() {
        document.getElementById('paymentLoading').classList.add('active');
    }
    
    showPaymentSuccess() {
        document.getElementById('paymentLoading').classList.remove('active');
        document.getElementById('paymentSuccess').style.display = 'block';
    }
    
    showPaymentFailed() {
        document.getElementById('paymentLoading').classList.remove('active');
        document.getElementById('paymentFailed').style.display = 'block';
    }
    
    showNotification(message, type = 'info') {
        this.elements.toastMessage.textContent = message;
        this.elements.notificationToast.className = `toast align-items-center text-white bg-${type} border-0`;
        const toast = new bootstrap.Toast(this.elements.notificationToast);
        toast.show();
    }
    
    showAICaption(caption) {
        document.getElementById('aiCaptionText').textContent = caption;
        document.getElementById('aiCaptionResult').classList.add('active');
    }
    
    hideAICaption() {
        document.getElementById('aiCaptionResult').classList.remove('active');
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('id-ID', options);
    }
    
    updateNavbar(user) {
        const dashboardNav = document.getElementById('dashboardNavItem');
        const logoutNav = document.getElementById('logoutNavItem');
        
        if (user) {
            dashboardNav.style.display = 'block';
            logoutNav.style.display = 'block';
            
            if (user.role === 'creator') {
                document.querySelector('[data-page="dashboard"]').innerHTML = 
                    '<i class="bi bi-speedometer2"></i> Dashboard Creator';
            }
        } else {
            dashboardNav.style.display = 'none';
            logoutNav.style.display = 'none';
        }
    }
    
    renderAnalytics(supports) {
        const ctx = document.getElementById('analyticsChart');
        if (!ctx) return;
        
        // Group supports by date
        const dailySupports = {};
        supports.forEach(support => {
            const date = support.created_at.split('T')[0];
            dailySupports[date] = (dailySupports[date] || 0) + support.amount;
        });
        
        const sortedDates = Object.keys(dailySupports).sort();
        const last7Days = sortedDates.slice(-7);
        const data = last7Days.map(date => dailySupports[date]);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
                datasets: [{
                    label: 'Saweria Harian',
                    data: data,
                    borderColor: '#6c63ff',
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID');
                            }
                        }
                    }
                }
            }
        });
        
        // Render top supporters
        const supporterCounts = {};
        supports.forEach(support => {
            supporterCounts[support.fan_name] = (supporterCounts[support.fan_name] || 0) + support.amount;
        });
        
        const topSupporters = Object.entries(supporterCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const topSupportersEl = document.getElementById('topSupporters');
        topSupportersEl.innerHTML = topSupporters.map(([name, amount], index) => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${index + 1}. ${name}</span>
                <strong>Rp ${amount.toLocaleString('id-ID')}</strong>
            </div>
        `).join('');
    }
}