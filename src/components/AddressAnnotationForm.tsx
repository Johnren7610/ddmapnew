import React, { useState } from 'react';
import { CreateAnnotationData } from '../api/annotations';
import { useTranslation } from '../hooks/useTranslation';

interface AddressAnnotationFormProps {
  initialData?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  onSubmit: (data: CreateAnnotationData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddressAnnotationForm: React.FC<AddressAnnotationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateAnnotationData>({
    address: initialData?.address || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    parkingConvenience: 3,
    hasDog: false,
    dogAggression: undefined,
    tipGiven: false,
    tipAmount: undefined,
    tipFrequency: 'never',
    accessDifficulty: 3,
    safetyRating: 3,
    customerRating: 3,
    deliveryTime: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false
    },
    buildingType: 'house',
    floorNumber: undefined,
    hasElevator: undefined,
    buzzerCode: '',
    specialInstructions: '',
    notes: ''
  });

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleRatingChange = (field: keyof CreateAnnotationData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof CreateAnnotationData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleDeliveryTimeChange = (timeSlot: keyof CreateAnnotationData['deliveryTime'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryTime: { ...prev.deliveryTime, [timeSlot]: checked }
    }));
  };

  const RatingStars = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-500`}
          >
            ⭐
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Address Annotation</h2>
        <p className="text-gray-600 mt-2">Share your delivery experience to help other drivers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Address Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!!initialData}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
                <select
                  value={formData.buildingType}
                  onChange={(e) => setFormData(prev => ({ ...prev, buildingType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="house">🏠 House</option>
                  <option value="apartment">🏢 Apartment</option>
                  <option value="condo">🏘️ Condo</option>
                  <option value="office">🏢 Office</option>
                  <option value="store">🏪 Store</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number (Optional)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.floorNumber || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, floorNumber: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ground floor = 0"
                />
              </div>
            </div>

            {formData.buildingType === 'apartment' && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.hasElevator || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, hasElevator: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Has Elevator</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buzzer Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.buzzerCode || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, buzzerCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., #123, *0000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Ratings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RatingStars
              value={formData.parkingConvenience}
              onChange={(value) => handleRatingChange('parkingConvenience', value)}
              label="🚗 Parking Convenience"
            />
            
            <RatingStars
              value={formData.accessDifficulty}
              onChange={(value) => handleRatingChange('accessDifficulty', value)}
              label="🚪 Access Difficulty (1=Easy, 5=Hard)"
            />
            
            <RatingStars
              value={formData.safetyRating}
              onChange={(value) => handleRatingChange('safetyRating', value)}
              label="🛡️ Safety Rating"
            />
            
            <RatingStars
              value={formData.customerRating}
              onChange={(value) => handleRatingChange('customerRating', value)}
              label="😊 Customer Rating"
            />
          </div>
        </div>

        {/* Dog Information */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🐕 Dog Information</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hasDog}
                onChange={(e) => handleCheckboxChange('hasDog', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">There is a dog at this address</span>
            </label>

            {formData.hasDog && (
              <RatingStars
                value={formData.dogAggression || 1}
                onChange={(value) => setFormData(prev => ({ ...prev, dogAggression: value }))}
                label="🐺 Dog Aggression Level (1=Friendly, 5=Aggressive)"
              />
            )}
          </div>
        </div>

        {/* Tip Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Tip Information</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.tipGiven}
                onChange={(e) => handleCheckboxChange('tipGiven', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Customer gives tips</span>
            </label>

            {formData.tipGiven && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tip Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={formData.tipAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipAmount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tip Frequency</label>
                  <select
                    value={formData.tipFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipFrequency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="never">Never</option>
                    <option value="rarely">Rarely</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="often">Often</option>
                    <option value="always">Always</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Time */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🕐 Best Delivery Times</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'morning' as const, label: '🌅 Morning (6-12)' },
              { key: 'afternoon' as const, label: '☀️ Afternoon (12-18)' },
              { key: 'evening' as const, label: '🌆 Evening (18-22)' },
              { key: 'night' as const, label: '🌙 Night (22-6)' }
            ].map(time => (
              <label key={time.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.deliveryTime[time.key]}
                  onChange={(e) => handleDeliveryTimeChange(time.key, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">{time.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              value={formData.specialInstructions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="e.g., Ring doorbell twice, use side entrance..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Any other helpful information for fellow drivers..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Annotation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressAnnotationForm;