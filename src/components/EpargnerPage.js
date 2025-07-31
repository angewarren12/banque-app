import React, { useState } from 'react';
import './EpargnerPage.css';

const EpargnerPage = ({ onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    montant: '',
    duree: '',
    compteSource: 'Compte Principal'
  });
  const [isLoading, setIsLoading] = useState(false);

  const produitsEpargne = [
    {
      id: 'livret-a',
      title: 'Livret A',
      description: 'Épargne réglementée, taux garanti',
      taux: '3%',
      plafond: '22 950€',
      icon: '💰',
      color: '#28A745',
      avantages: ['Taux garanti', 'Liquidité immédiate', 'Exonération fiscale']
    },
    {
      id: 'ldds',
      title: 'LDDS',
      description: 'Livret de développement durable',
      taux: '3%',
      plafond: '12 000€',
      icon: '🌱',
      color: '#20C997',
      avantages: ['Taux garanti', 'Financement écologique', 'Exonération fiscale']
    },
    {
      id: 'pea',
      title: 'PEA',
      description: 'Plan d\'épargne en actions',
      taux: 'Variable',
      plafond: '150 000€',
      icon: '📈',
      color: '#FF6B35',
      avantages: ['Fiscalité avantageuse', 'Potentiel de rendement', 'Long terme']
    },
    {
      id: 'assurance-vie',
      title: 'Assurance Vie',
      description: 'Épargne flexible et sécurisée',
      taux: 'Variable',
      plafond: 'Illimité',
      icon: '🛡️',
      color: '#6F42C1',
      avantages: ['Flexibilité', 'Transmission', 'Fiscalité avantageuse']
    }
  ];

  const durees = [
    { value: '1', label: '1 mois' },
    { value: '3', label: '3 mois' },
    { value: '6', label: '6 mois' },
    { value: '12', label: '1 an' },
    { value: '24', label: '2 ans' },
    { value: '60', label: '5 ans' }
  ];

  const comptes = [
    { id: 1, nom: 'Compte Principal', solde: 1847.50 },
    { id: 2, nom: 'Épargne en ligne', solde: 1000.00 }
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="epargner-overlay">
      <div className="epargner-modal">
        <div className="modal-header">
          <h1>Épargner</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {!selectedProduct ? (
            <div className="products-grid">
              <h2>Choisissez votre produit d'épargne</h2>
              {produitsEpargne.map(produit => (
                <div
                  key={produit.id}
                  className="product-option"
                  onClick={() => setSelectedProduct(produit.id)}
                  style={{'--product-color': produit.color}}
                >
                  <div className="product-header">
                    <div className="product-icon">{produit.icon}</div>
                    <div className="product-info">
                      <h3>{produit.title}</h3>
                      <p>{produit.description}</p>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Taux :</span>
                      <span className="value">{produit.taux}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Plafond :</span>
                      <span className="value">{produit.plafond}</span>
                    </div>
                  </div>
                  <div className="product-advantages">
                    {produit.avantages.map((avantage, index) => (
                      <span key={index} className="advantage-tag">{avantage}</span>
                    ))}
                  </div>
                  <div className="product-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="epargner-form">
              <h2>{produitsEpargne.find(p => p.id === selectedProduct)?.title}</h2>
              
              <div className="form-group">
                <label>Montant à épargner (€)</label>
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({...formData, montant: e.target.value})}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Compte source</label>
                <select
                  value={formData.compteSource}
                  onChange={(e) => setFormData({...formData, compteSource: e.target.value})}
                >
                  {comptes.map(compte => (
                    <option key={compte.id} value={compte.nom}>
                      {compte.nom} - {compte.solde.toLocaleString('fr-FR')}€
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Durée (optionnel)</label>
                <select
                  value={formData.duree}
                  onChange={(e) => setFormData({...formData, duree: e.target.value})}
                >
                  <option value="">Sans durée fixe</option>
                  {durees.map(duree => (
                    <option key={duree.value} value={duree.value}>
                      {duree.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="simulation">
                <h3>Simulation de rendement</h3>
                <div className="simulation-result">
                  <div className="simulation-item">
                    <span>Montant initial :</span>
                    <span>{formData.montant ? parseFloat(formData.montant).toLocaleString('fr-FR') : '0'}€</span>
                  </div>
                  <div className="simulation-item">
                    <span>Intérêts estimés (1 an) :</span>
                    <span>{formData.montant ? (parseFloat(formData.montant) * 0.03).toFixed(2) : '0'}€</span>
                  </div>
                  <div className="simulation-item total">
                    <span>Capital final estimé :</span>
                    <span>{formData.montant ? (parseFloat(formData.montant) * 1.03).toFixed(2) : '0'}€</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setSelectedProduct('')}>
                  Retour
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Création en cours...' : 'Créer l\'épargne'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpargnerPage; 