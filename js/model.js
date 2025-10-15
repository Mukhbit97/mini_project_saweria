
// ==================== MODEL ====================
export class Model {
    constructor() {
        this.state = {
            currentUser: null,
            creators: [],
            posts: [],
            supports: [],
            balances: {},
            currentView: 'creators',
            selectedCreator: null,
            socketConnected: false
        };
        
        this.initializeData();
    }
    
    initializeData() {
        // Dummy creators
        this.state.creators = [
            {
                id: 1,
                name: "Sarah Artist",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator1/200/200.jpg",
                bio: "Seniman digital yang menciptakan karya-karya indah dengan sentuhan modern.",
                email: "sarah@creator.com"
            },
            {
                id: 2,
                name: "Budi Photography",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator2/200/200.jpg",
                bio: "Fotografer profesional yang fokus pada landscape dan potret.",
                email: "budi@creator.com"
            },
            {
                id: 3,
                name: "Maya Music",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator3/200/200.jpg",
                bio: "Musisi independen yang menciptakan musik dengan sentuhan etnik.",
                email: "maya@creator.com"
            }
        ];
        
        // Dummy posts
        this.state.posts = [
            {
                id: 1,
                creator_id: 1,
                text: "Karya terbaru saya! Terinspirasi dari matahari terbenam di pantai. Semoga kalian suka!",
                media_url: "https://picsum.photos/seed/post1/600/400.jpg",
                created_at: new Date(Date.now() - 86400000).toISOString(),
                likes: 42,
                comments: 8
            },
            {
                id: 2,
                creator_id: 1,
                text: "Proses pembuatan karya digital dari awal hingga selesai. Butuh 3 hari untuk menyelesaikannya!",
                media_url: "https://picsum.photos/seed/post2/600/400.jpg",
                created_at: new Date(Date.now() - 172800000).toISOString(),
                likes: 38,
                comments: 12
            },
            {
                id: 3,
                creator_id: 2,
                text: "Momen indah saat matahari terbit di Gunung Bromo. Sangat memukau!",
                media_url: "https://picsum.photos/seed/post3/600/400.jpg",
                created_at: new Date(Date.now() - 259200000).toISOString(),
                likes: 56,
                comments: 15
            },
            {
                id: 4,
                creator_id: 2,
                text: "Potret candid di jalanan Jakarta. Setiap sudut memiliki ceritanya sendiri.",
                media_url: "https://picsum.photos/seed/post4/600/400.jpg",
                created_at: new Date(Date.now() - 345600000).toISOString(),
                likes: 29,
                comments: 6
            },
            {
                id: 5,
                creator_id: 3,
                text: "Lagu baru saya 'Rindu Kampung Halaman'. Semoga bisa menghibur kalian yang sedang merantau.",
                media_url: "https://picsum.photos/seed/post5/600/400.jpg",
                created_at: new Date(Date.now() - 432000000).toISOString(),
                likes: 73,
                comments: 21
            },
            {
                id: 6,
                creator_id: 3,
                text: "Behind the scene saat rekaman di studio. Proses kreatif yang sangat menyenangkan!",
                media_url: "https://picsum.photos/seed/post6/600/400.jpg",
                created_at: new Date(Date.now() - 518400000).toISOString(),
                likes: 45,
                comments: 9
            }
        ];
        
        // Initialize balances
        this.state.creators.forEach(creator => {
            this.state.balances[creator.id] = Math.floor(Math.random() * 500000) + 100000;
        });
        
        // Dummy users for login
        this.state.users = [
            {
                id: 101,
                name: "Andi Fan",
                role: "fan",
                avatar: "https://picsum.photos/seed/fan1/200/200.jpg",
                email: "andi@fan.com"
            },
            {
                id: 102,
                name: "Rina Supporter",
                role: "fan",
                avatar: "https://picsum.photos/seed/fan2/200/200.jpg",
                email: "rina@fan.com"
            },
            {
                id: 1,
                name: "Sarah Artist",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator1/200/200.jpg",
                email: "sarah@creator.com"
            },
            {
                id: 2,
                name: "Budi Photography",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator2/200/200.jpg",
                email: "budi@creator.com"
            },
            {
                id: 3,
                name: "Maya Music",
                role: "creator",
                avatar: "https://picsum.photos/seed/creator3/200/200.jpg",
                email: "maya@creator.com"
            }
        ];
        
        // Generate dummy support history
        this.generateDummySupports();
    }
    
    generateDummySupports() {
        const fans = this.state.users.filter(u => u.role === 'fan');
        const creators = this.state.creators;
        
        fans.forEach(fan => {
            creators.forEach(creator => {
                const numSupports = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < numSupports; i++) {
                    const amount = [10000, 25000, 50000, 75000, 100000][Math.floor(Math.random() * 5)];
                    const support = {
                        id: Date.now() + Math.random(),
                        fan_id: fan.id,
                        fan_name: fan.name,
                        creator_id: creator.id,
                        creator_name: creator.name,
                        amount: amount,
                        status: 'paid',
                        payment_method: ['transfer', 'ewallet', 'card'][Math.floor(Math.random() * 3)],
                        message: `Terima kasih atas karyanya!`,
                        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                    };
                    this.state.supports.push(support);
                }
            });
        });
    }
    
    setCurrentUser(user) {
        this.state.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    logout() {
        this.state.currentUser = null;
        localStorage.removeItem('currentUser');
    }
    
    addPost(post) {
        this.state.posts.unshift(post);
    }
    
    addSupport(support) {
        this.state.supports.push(support);
        this.state.balances[support.creator_id] = (this.state.balances[support.creator_id] || 0) + support.amount;
    }
    
    getCreatorPosts(creatorId) {
        return this.state.posts.filter(p => p.creator_id === creatorId);
    }
    
    getCreatorSupports(creatorId) {
        return this.state.supports.filter(s => s.creator_id === creatorId);
    }
    
    getFanSupports(fanId) {
        return this.state.supports.filter(s => s.fan_id === fanId);
    }
    
    getCreatorStats(creatorId) {
        const supports = this.getCreatorSupports(creatorId);
        const posts = this.getCreatorPosts(creatorId);
        const uniqueSupporters = [...new Set(supports.map(s => s.fan_id))].length;
        const totalAmount = supports.reduce((sum, s) => sum + s.amount, 0);
        const avgSupport = supports.length > 0 ? totalAmount / supports.length : 0;
        
        return {
            totalSupporters: uniqueSupporters,
            totalPosts: posts.length,
            totalAmount: totalAmount,
            avgSupport: avgSupport
        };
    }
}