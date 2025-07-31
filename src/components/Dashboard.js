import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { comptesService } from '../services/comptesService';
import { transactionsService } from '../services/transactionsService';
import { notificationsService } from '../services/notificationsService';
import './Dashboard.css';
import VirementPage from './VirementPage';
import PaiementPage from './PaiementPage';
import RechargerPage from './RechargerPage';
import EpargnerPage from './EpargnerPage';
import BeneficiairesPage from './BeneficiairesPage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // États pour les modales
  const [showVirement, setShowVirement] = useState(false);
  const [showPaiement, setShowPaiement] = useState(false);
  const [showRecharger, setShowRecharger] = useState(false);
  const [showEpargner, setShowEpargner] = useState(false);
  const [showBeneficiaires, setShowBeneficiaires] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [savingsData] = useState([
    {
      id: 1,
      type: 'Livret A',
      montant: 1250.00,
      taux: 3.0,
      evolution: '+2.1%',
      icon: 'fas fa-piggy-bank',
      couleur: '#00A651',
      description: 'Épargne sécurisée et disponible'
    },
    {
      id: 2,
      type: 'PEA',
      montant: 3450.00,
      taux: 8.5,
      evolution: '+12.3%',
      icon: 'fas fa-chart-line',
      couleur: '#FF6B35',
      description: 'Plan d\'épargne en actions'
    },
    {
      id: 3,
      type: 'LDDS',
      montant: 800.00,
      taux: 3.0,
      evolution: '+1.8%',
      icon: 'fas fa-coins',
      couleur: '#667eea',
      description: 'Livret de développement durable'
    }
  ]);

  // Données utilisateur et comptes
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer l'utilisateur connecté
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/');
        return;
      }
      
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Récupérer les comptes
      const userAccounts = await comptesService.getComptes(userData.id);
      setAccounts(userAccounts);

      // Calculer le solde total
      const total = userAccounts.reduce((sum, account) => sum + parseFloat(account.solde), 0);
      setTotalBalance(total);

      // Récupérer les transactions récentes
      const transactions = await transactionsService.getRecentTransactions(userData.id, 5);
      setRecentTransactions(transactions);

      // Récupérer les notifications
      const userNotifications = await notificationsService.getUnreadNotifications(userData.id);
      setNotifications(userNotifications);

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Fonction de rafraîchissement des données
  const refreshDashboardData = async () => {
    console.log('🔄 DASH DEBUG: Rafraîchissement des données du dashboard');
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const quickActions = [
    { id: 1, title: 'Virement', color: '#008854', icon: 'fas fa-exchange-alt', action: () => setShowVirement(true) },
    { id: 2, title: 'Paiement', color: '#FF6B35', icon: 'fas fa-credit-card', action: () => setShowPaiement(true) },
    { id: 3, title: 'Épargner', color: '#4ECDC4', icon: 'fas fa-piggy-bank', action: () => setShowEpargner(true) },
    { id: 4, title: 'Bénéficiaires', color: '#45B7D1', icon: 'fas fa-user-plus', action: () => setShowBeneficiaires(true) }
  ];

  // Données du conseiller client
  const conseillerClient = {
    name: 'Marie Dubois',
    role: 'Conseiller Client',
    phone: '01 42 34 56 78',
    email: 'marie.dubois@bnpparibas.fr',
    avatar: 'https://cdn-icons-png.flaticon.com/512/6676/6676023.png'
  };

  // Notifications simulées
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'security',
        title: 'Connexion détectée',
        message: 'Nouvelle connexion depuis Paris',
        time: 'Il y a 5 min',
        read: false
      },
      {
        id: 2,
        type: 'transaction',
        title: 'Transaction importante',
        message: 'Paiement de 120€ à EDF',
        time: 'Il y a 1h',
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'Maintenance prévue',
        message: 'Maintenance le 25/01 de 2h à 4h',
        time: 'Il y a 2h',
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Gestion du mode sombre
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleQuickAction = (action) => {
    if (action.action) {
      action.action();
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert(`Fonctionnalité ${action.title} en cours de développement`);
      }, 1000);
    }
  };

  const handleCardAction = (card, action) => {
    setTimeout(() => {
      alert(`Action ${action} pour la carte ${card.type}`);
    }, 500);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Fonction pour obtenir la date et heure actuelles
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const time = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${date} à ${time}`;
  };

  // Fonction pour gérer le clic sur "Voir le détail"
  const handleViewDetail = () => {
    setShowDetailModal(true);
  };

  // Fonction pour gérer le clic sur "Évolution"
  const handleViewEvolution = () => {
    setShowEvolutionModal(true);
  };

  const renderAccueil = () => (
    <div className="dashboard-content">
      {/* Header avec salutation */}
      <div className="welcome-header">
        <div className="welcome-text">
          <div className="welcome-line">
            <h1>Bonjour, {user?.nom || 'Utilisateur'}</h1>
            <button className="profile-avatar" onClick={() => alert('Redirection vers le profil')}>
              <span>{user?.nom?.charAt(0) || 'U'}</span>
            </button>
          </div>
          <p>Voici un aperçu de vos finances</p>
          <div className="login-info">
            <span className="last-login">Dernière connexion : {getCurrentDateTime()}</span>
            <span className="location">📍 {user?.adresse || 'Paris, France'}</span>
            {isRefreshing && (
              <span className="refreshing-indicator">
                <i className="fas fa-sync-alt fa-spin"></i> Mise à jour...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Carte de solde principal */}
      <div className="balance-card">
        <div className="balance-header">
          <h3>Solde total</h3>
          <div className="balance-currency">{user?.devise || 'EUR'}</div>
        </div>
        <div className="balance-amount">
          {totalBalance.toLocaleString('fr-FR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })} {user?.devise || '€'}
        </div>
        <div className="balance-trend">
          <span className="trend-up">↗ +2.5% ce mois</span>
        </div>
        <div className="balance-actions">
          <button className="balance-action-btn" onClick={handleViewDetail}>
            <i className="fas fa-chart-bar"></i> Voir le détail
          </button>
          <button className="balance-action-btn" onClick={handleViewEvolution}>
            <i className="fas fa-chart-line"></i> Évolution
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions-section">
        <h3>Actions rapides</h3>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <div 
              key={action.id} 
              className="quick-action-item" 
              style={{'--action-color': action.color}}
              onClick={() => handleQuickAction(action)}
            >
              <div className="action-icon">
                <i className={action.icon}></i>
              </div>
              <span>{action.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comptes */}
      <div className="accounts-section">
        <div className="section-header">
          <h3>Mes comptes</h3>
          <button className="see-all-btn">Voir tout</button>
        </div>
        <div className="accounts-slider">
          <div className="accounts-scroll">
            {accounts.map(account => (
              <div key={account.id} className="account-card" style={{'--account-color': '#008854'}}>
                <div className="account-header">
                  <div className="account-icon">
                    <div className="flat-icon" style={{'--icon-color': '#008854'}}></div>
                  </div>
                  <div className="account-info">
                    <h4>{account.type}</h4>
                    <span className="account-number">{account.numero_compte}</span>
                    <span className="account-status">{account.statut}</span>
                  </div>
                </div>
                <div className="account-balance">
                  {account.solde.toLocaleString('fr-FR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} {account.devise}
                </div>
                <div className="account-actions">
                  <button className="account-action-btn">
                    <i className="fas fa-chart-bar"></i> Détails
                  </button>
                  <button className="account-action-btn" onClick={() => setShowVirement(true)}>
                    <i className="fas fa-exchange-alt"></i> Virement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dernières transactions */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Dernières transactions</h3>
          <button className="see-all-btn" onClick={() => setActiveTab('historique')}>Voir tout</button>
        </div>
        <div className="transactions-list">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon" style={{'--transaction-color': transaction.type === 'credit' || transaction.type === 'virement_entrant' ? '#00A651' : '#FF6B35'}}>
                <i className={transaction.icon || 'fas fa-exchange-alt'}></i>
              </div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <span className="transaction-description">{transaction.description}</span>
                  <span className="transaction-category">{transaction.categorie || 'Transfert'}</span>
                  <span className="transaction-location">{transaction.localisation || 'Virement bancaire'}</span>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-date">
                    {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')} à {transaction.heure_transaction}
                  </span>
                  <span className={`transaction-status ${transaction.statut}`}>
                    {transaction.statut === 'completed' || transaction.statut === 'traite' ? 
                      <><i className="fas fa-check-circle"></i> Terminé</> : 
                      transaction.statut === 'en_attente' || transaction.statut === 'en_validation' ?
                      <><i className="fas fa-clock"></i> En cours</> :
                      <><i className="fas fa-exclamation-triangle"></i> En attente</>
                    }
                  </span>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type === 'credit' || transaction.type === 'virement_entrant' ? 'credit' : 'debit'}`}>
                {(transaction.type === 'credit' || transaction.type === 'virement_entrant') ? '+' : '-'}
                {Math.abs(parseFloat(transaction.montant)).toLocaleString('fr-FR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} {transaction.devise || '€'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section d'épargne et investissements */}
      <div className="savings-section">
        <div className="section-header">
          <h3>Épargne & Investissements</h3>
          <button className="see-all-btn" onClick={() => setShowEpargner(true)}>Gérer</button>
        </div>
        <div className="savings-grid">
          {savingsData.map(saving => (
            <div key={saving.id} className="savings-card">
              <div className="savings-icon" style={{'--saving-color': saving.couleur}}>
                <i className={saving.icon}></i>
              </div>
              <div className="savings-info">
                <h4>{saving.type}</h4>
                <span className="savings-amount">{saving.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                <span className="savings-rate">{saving.taux}%</span>
                <span className="savings-evolution">{saving.evolution}</span>
                <span className="savings-description">{saving.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section conseiller client */}
      <div className="conseiller-section">
        <div className="section-header">
          <h3>Conseiller client</h3>
          <button className="contact-btn" onClick={() => alert('Ouverture du chat avec le conseiller')}>
            <i className="fas fa-comments"></i> Contacter
          </button>
        </div>
        <div className="conseiller-card">
          <div className="conseiller-avatar">
            <img src={conseillerClient.avatar} alt={conseillerClient.name} />
          </div>
          <div className="conseiller-info">
            <h4>{conseillerClient.name}</h4>
            <span className="conseiller-role">{conseillerClient.role}</span>
            <div className="conseiller-contact">
              <span className="contact-item">
                <i className="fas fa-phone"></i> {conseillerClient.phone}
              </span>
              <span className="contact-item">
                <i className="fas fa-envelope"></i> {conseillerClient.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistorique = () => {
    // Données des transactions
    const allTransactions = [
      { id: 1, type: 'debit', amount: -45.20, description: 'Carrefour', category: 'Courses', date: '15/01/2024', time: '14:30', icon: 'fas fa-shopping-cart', location: 'Paris, France', status: 'completed' },
      { id: 2, type: 'credit', amount: 2500.00, description: 'Salaire', category: 'Revenus', date: '10/01/2024', time: '09:15', icon: 'fas fa-briefcase', location: 'Entreprise SA', status: 'completed' },
      { id: 3, type: 'debit', amount: -120.00, description: 'EDF', category: 'Factures', date: '08/01/2024', time: '11:45', icon: 'fas fa-bolt', location: 'EDF France', status: 'pending' },
      { id: 4, type: 'debit', amount: -89.99, description: 'Amazon', category: 'Shopping', date: '05/01/2024', time: '16:20', icon: 'fas fa-box', location: 'Amazon France', status: 'completed' },
      { id: 5, type: 'credit', amount: 500.00, description: 'Virement', category: 'Transfert', date: '03/01/2024', time: '13:10', icon: 'fas fa-dollar-sign', location: 'Compte externe', status: 'completed' },
      { id: 6, type: 'debit', amount: -35.50, description: 'McDonald\'s', category: 'Restaurant', date: '12/01/2024', time: '19:30', icon: 'fas fa-utensils', location: 'Paris, France', status: 'completed' },
      { id: 7, type: 'credit', amount: 150.00, description: 'Remboursement', category: 'Revenus', date: '11/01/2024', time: '10:20', icon: 'fas fa-hand-holding-usd', location: 'Assurance', status: 'completed' },
      { id: 8, type: 'debit', amount: -65.00, description: 'Total', category: 'Essence', date: '09/01/2024', time: '16:45', icon: 'fas fa-gas-pump', location: 'Paris, France', status: 'completed' }
    ];

    // Filtrer les transactions
    const filteredTransactions = allTransactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Historique des transactions</h2>
          <div className="header-actions">
            <button className="export-btn">📊 Exporter</button>
            <button className="filter-btn">🔍 Filtres avancés</button>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Filtres */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Toutes
          </button>
          <button 
            className={`filter-tab ${filterType === 'credit' ? 'active' : ''}`}
            onClick={() => setFilterType('credit')}
          >
            Revenus
          </button>
          <button 
            className={`filter-tab ${filterType === 'debit' ? 'active' : ''}`}
            onClick={() => setFilterType('debit')}
          >
            Dépenses
          </button>
        </div>
        
        {/* Résultats */}
        <div className="results-info">
          <span>{filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''} trouvée{filteredTransactions.length > 1 ? 's' : ''}</span>
          <div className="results-summary">
            <span>Total : {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
          </div>
        </div>
        
        <div className="transactions-list full-list">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon" style={{'--transaction-color': transaction.type === 'credit' ? '#00A651' : '#FF6B35'}}>
                  <i className={transaction.icon}></i>
                </div>
                <div className="transaction-details">
                  <div className="transaction-main">
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-location">{transaction.location}</span>
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-date">{transaction.date} à {transaction.time}</span>
                    <span className={`transaction-status ${transaction.status}`}>
                      {transaction.status === 'completed' ? '✅ Terminé' : '⏳ En cours'}
                    </span>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'credit' ? '+' : ''}
                  {transaction.amount.toLocaleString('fr-FR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} €
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Aucune transaction trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCartes = () => {
    const cards = [
      {
        id: 1,
        type: 'Visa',
        number: '**** **** **** 1234',
        holder: user?.nom || 'Titulaire',
        expiry: '12/25',
        cvv: '123',
        status: 'active',
        balance: 1847.50,
        limit: 5000,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        logo: '💳',
        features: ['Paiement sans contact', 'Paiement en ligne', 'Retraits ATM'],
        lastTransaction: 'Carrefour - 45,20€',
        lastTransactionDate: 'Aujourd\'hui 14:30'
      },
      {
        id: 2,
        type: 'Mastercard',
        number: '**** **** **** 5678',
        holder: user?.nom || 'Titulaire',
        expiry: '08/26',
        cvv: '456',
        status: 'inactive',
        balance: 0,
        limit: 3000,
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        logo: '💳',
        features: ['Paiement sans contact', 'Paiement en ligne'],
        lastTransaction: 'Aucune transaction récente',
        lastTransactionDate: '-'
      },
      {
        id: 3,
        type: 'Visa Business',
        number: '**** **** **** 9012',
        holder: user?.nom || 'Titulaire',
        expiry: '03/27',
        cvv: '789',
        status: 'active',
        balance: 2500.00,
        limit: 10000,
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        logo: '💳',
        features: ['Paiement sans contact', 'Paiement en ligne', 'Retraits ATM', 'Assurance voyage'],
        lastTransaction: 'Amazon - 89,99€',
        lastTransactionDate: '05/01 16:20'
      }
    ];

    return (
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Mes cartes bancaires</h2>
          <button className="add-card-btn">+ Nouvelle carte</button>
        </div>
        
        {/* Résumé des cartes */}
        <div className="cards-summary">
          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <div className="summary-info">
              <span className="summary-label">Cartes actives</span>
              <span className="summary-value">{cards.filter(card => card.status === 'active').length}</span>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="summary-info">
              <span className="summary-label">Solde total</span>
              <span className="summary-value">
                {cards.reduce((total, card) => total + card.balance, 0).toLocaleString('fr-FR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} €
              </span>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="summary-info">
              <span className="summary-label">Limite totale</span>
              <span className="summary-value">
                {cards.reduce((total, card) => total + card.limit, 0).toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>
        </div>
        
        {/* Cartes */}
        <div className="cards-section">
          {cards.map(card => (
            <div key={card.id} className={`card-item ${card.status}`} style={{'--card-gradient': card.color}}>
              <div className="card-visual">
                <div className="card-header">
                  <div className="card-logo">{card.logo}</div>
                  <div className="card-type">{card.type}</div>
                  <div className={`card-status ${card.status}`}>
                    {card.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="card-number">{card.number}</div>
                
                <div className="card-details">
                  <div className="card-info">
                    <div className="card-holder">
                      <span className="label">Titulaire</span>
                      <span className="value">{card.holder}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">Expire</span>
                      <span className="value">{card.expiry}</span>
                    </div>
                  </div>
                  <div className="card-balance">
                    <span className="balance-label">Solde disponible</span>
                    <span className="card-balance-amount">
                      {card.balance.toLocaleString('fr-FR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} €
                    </span>
                  </div>
                </div>

                {/* Dernière transaction */}
                <div className="last-transaction">
                  <span className="last-transaction-label">Dernière transaction</span>
                  <span className="last-transaction-value">{card.lastTransaction}</span>
                  <span className="last-transaction-date">{card.lastTransactionDate}</span>
                </div>
              </div>
              
              <div className="card-features">
                <div className="features-list">
                  {card.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="card-action-btn primary"
                  onClick={() => handleCardAction(card, card.status === 'active' ? 'Bloquer' : 'Activer')}
                >
                  <span className="action-icon">
                    <i className="fas fa-lock"></i>
                  </span>
                  {card.status === 'active' ? 'Bloquer' : 'Activer'}
                </button>
                <button 
                  className="card-action-btn secondary"
                  onClick={() => handleCardAction(card, 'Paramètres')}
                >
                  <span className="action-icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  Paramètres
                </button>
                <button 
                  className="card-action-btn secondary"
                  onClick={() => handleCardAction(card, 'Limites')}
                >
                  <span className="action-icon">
                    <i className="fas fa-chart-bar"></i>
                  </span>
                  Limites
                </button>
                <button 
                  className="card-action-btn secondary"
                  onClick={() => handleCardAction(card, 'Apple Pay')}
                >
                  <span className="action-icon">
                    <i className="fab fa-apple-pay"></i>
                  </span>
                  Apple Pay
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Actions rapides */}
        <div className="quick-actions-section">
          <h3>Actions rapides</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-item">
              <div className="action-icon">
                <i className="fas fa-lock"></i>
              </div>
              <span>Bloquer une carte</span>
            </button>
            <button className="quick-action-item">
              <div className="action-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <span>Modifier les limites</span>
            </button>
            <button className="quick-action-item">
              <div className="action-icon">
                <i className="fab fa-apple-pay"></i>
              </div>
              <span>Configurer Apple Pay</span>
            </button>
            <button className="quick-action-item">
              <div className="action-icon">
                <i className="fas fa-globe"></i>
              </div>
              <span>Activer l'international</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return renderAccueil();
      case 'historique':
        return renderHistorique();
      case 'cartes':
        return renderCartes();
      default:
        return renderAccueil();
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header fixe */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="bnp-logo">
              <img src="https://logo-marque.com/wp-content/uploads/2021/03/BNP-Paribas-Logo.png" alt="BNP Paribas" className="logo-image" />
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="header-btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="fas fa-bell"></i>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button 
              className="header-btn theme-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            <button className="header-btn">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        {/* Panneau de notifications */}
        {showNotifications && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button 
                className="close-notifications"
                onClick={() => setShowNotifications(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'security' ? <i className="fas fa-shield-alt"></i> : 
                     notification.type === 'transaction' ? <i className="fas fa-credit-card"></i> : 
                     <i className="fas fa-info-circle"></i>}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="dashboard-main">
        {renderContent()}
      </div>

      {/* Menu de navigation mobile fixe */}
      <div className="mobile-nav">
        <button 
          className={`nav-item ${activeTab === 'accueil' ? 'active' : ''}`}
          onClick={() => setActiveTab('accueil')}
        >
          <div className="nav-icon">
            <i className="fas fa-home"></i>
          </div>
          <span>Accueil</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'historique' ? 'active' : ''}`}
          onClick={() => setActiveTab('historique')}
        >
          <div className="nav-icon">
            <i className="fas fa-history"></i>
          </div>
          <span>Historique</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'cartes' ? 'active' : ''}`}
          onClick={() => setActiveTab('cartes')}
        >
          <div className="nav-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <span>Cartes</span>
        </button>
        <button className="nav-item" onClick={() => setShowVirement(true)}>
          <div className="nav-icon">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <span>Virement</span>
        </button>
      </div>

      {/* Overlay de chargement */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner-large"></div>
          <span>Chargement...</span>
        </div>
      )}

      {/* Modales */}
      {showVirement && <VirementPage 
        onClose={() => setShowVirement(false)}
        onVirementCompleted={() => {
          console.log('🔄 DASH DEBUG: Virement terminé, rafraîchissement des données');
          setTimeout(() => refreshDashboardData(), 1000);
        }}
      />}
      {showPaiement && <PaiementPage onClose={() => setShowPaiement(false)} />}
      {showRecharger && <RechargerPage onClose={() => setShowRecharger(false)} />}
      {showEpargner && <EpargnerPage onClose={() => setShowEpargner(false)} />}
      {showBeneficiaires && <BeneficiairesPage onClose={() => setShowBeneficiaires(false)} />}

      {/* Modal Voir le détail */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détail du solde</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Répartition par compte</h3>
                <div className="accounts-breakdown">
                  {accounts.map(account => (
                    <div key={account.id} className="account-breakdown-item">
                      <div className="account-breakdown-info">
                        <span className="account-name">{account.type}</span>
                        <span className="account-number">{account.numero_compte}</span>
                      </div>
                      <div className="account-breakdown-amount">
                        {account.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Mouvements récents</h3>
                <div className="recent-movements">
                  {recentTransactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="movement-item">
                      <div className="movement-info">
                        <span className="movement-description">{transaction.description}</span>
                        <span className="movement-date">
                          {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className={`movement-amount ${transaction.type === 'credit' ? 'positive' : 'negative'}`}>
                        {(transaction.type === 'credit' ? '+' : '-')}
                        {Math.abs(parseFloat(transaction.montant)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Évolution */}
      {showEvolutionModal && (
        <div className="modal-overlay" onClick={() => setShowEvolutionModal(false)}>
          <div className="modal-content evolution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Évolution du solde</h2>
              <button className="modal-close" onClick={() => setShowEvolutionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="evolution-chart">
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <h3>Graphique d'évolution</h3>
                  <p>Visualisation de l'évolution de votre solde sur les 12 derniers mois</p>
                </div>
              </div>
              
              <div className="evolution-stats">
                <div className="stat-item">
                  <span className="stat-label">Solde actuel</span>
                  <span className="stat-value">{totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Évolution ce mois</span>
                  <span className="stat-value positive">+2.5%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Évolution ce trimestre</span>
                  <span className="stat-value positive">+7.2%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Évolution cette année</span>
                  <span className="stat-value positive">+15.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 