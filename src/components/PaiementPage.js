import React, { useState } from 'react';
import './PaiementPage.css';

const PaiementPage = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    montant: '',
    beneficiaire: '',
    reference: '',
    motif: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const paiementOptions = [
    {
      id: 'sepa',
      title: 'Paiement SEPA',
      description: 'Paiement vers un compte bancaire européen',
      icon: '🏦',
      color: '#008854'
    },
    {
      id: 'facture',
      title: 'Paiement de facture',
      description: 'Payer une facture avec référence',
      icon: '📄',
      color: '#FF6B35'
    },
    {
      id: 'mobile',
      title: 'Paiement mobile',
      description: 'Paiement par téléphone portable',
      icon: '📱',
      color: '#4ECDC4'
    },
    {
      id: 'urgence',
      title: 'Paiement d\'urgence',
      description: 'Paiement traité en priorité',
      icon: '🚨',
      color: '#DC3545'
    }
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="paiement-overlay">
      <div className="paiement-modal">
        <div className="modal-header">
          <h1>Nouveau paiement</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {!selectedOption ? (
            <div className="options-grid">
              <h2>Choisissez le type de paiement</h2>
              {paiementOptions.map(option => (
                <div
                  key={option.id}
                  className="paiement-option"
                  onClick={() => setSelectedOption(option.id)}
                  style={{'--option-color': option.color}}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-content">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                  <div className="option-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="paiement-form">
              <h2>Paiement {paiementOptions.find(o => o.id === selectedOption)?.title}</h2>
              
              <div className="form-group">
                <label>Montant (€)</label>
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({...formData, montant: e.target.value})}
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Bénéficiaire</label>
                <input
                  type="text"
                  value={formData.beneficiaire}
                  onChange={(e) => setFormData({...formData, beneficiaire: e.target.value})}
                  placeholder="Nom du bénéficiaire"
                />
              </div>

              <div className="form-group">
                <label>Référence</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  placeholder="Référence du paiement"
                />
              </div>

              <div className="form-group">
                <label>Motif</label>
                <textarea
                  value={formData.motif}
                  onChange={(e) => setFormData({...formData, motif: e.target.value})}
                  placeholder="Motif du paiement"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setSelectedOption('')}>
                  Retour
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Traitement...' : 'Confirmer le paiement'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementPage; 