import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Share2, Copy, Check, Palette, Zap, Camera, X } from 'lucide-react';
import QRCodeLib from 'qrcode';

export const QRGenerator: React.FC = () => {
  const [shopName, setShopName] = useState('My Salon');
  const [qrStyle, setQrStyle] = useState<'standard' | 'branded' | 'premium'>('standard');
  const [copied, setCopied] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const generateQRCode = () => {
    const shopId = btoa(shopName).replace(/=/g, '');
    return `${window.location.origin}/checkin/${shopId}`;
  };

  const generateQRCodeImage = async () => {
    try {
      const url = generateQRCode();
      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: qrStyle === 'premium' ? '#7C3AED' : qrStyle === 'branded' ? '#2563EB' : '#000000',
          light: '#FFFFFF'
        }
      };
      
      const dataURL = await QRCodeLib.toDataURL(url, options);
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQRCodeImage();
  }, [shopName, qrStyle]);

  const handleCopyLink = async () => {
    const link = generateQRCode();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `${shopName.replace(/\s+/g, '_')}_QR_Code.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeDataURL) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], `${shopName}_QR_Code.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${shopName} - QR Code`,
          text: `Scan this QR code to check in at ${shopName}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to copying link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  const simulateQRScan = () => {
    // Simulate QR code scanning for demo purposes
    setTimeout(() => {
      const mockCustomerId = Math.random().toString(36).substr(2, 9);
      setScanResult(`Customer ID: ${mockCustomerId} checked in successfully!`);
      stopCamera();
      
      // Clear result after 3 seconds
      setTimeout(() => setScanResult(''), 3000);
    }, 2000);
  };

  const qrStyles = {
    standard: {
      name: 'Standard',
      description: 'Basic black & white QR code',
      price: 'Free',
      color: 'emerald'
    },
    branded: {
      name: 'Branded',
      description: 'Blue colored QR code',
      price: 'KES 500/month',
      color: 'blue'
    },
    premium: {
      name: 'Premium',
      description: 'Purple premium design',
      price: 'KES 1,000/month',
      color: 'purple'
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Create and scan QR codes for faster customer check-ins</p>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Check className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-sm lg:text-base text-emerald-800 font-semibold">{scanResult}</p>
            </div>
          </div>
        )}

        <div className="grid xl:grid-cols-3 gap-6 lg:gap-8">
          {/* QR Code Preview */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky top-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Preview</h3>
              
              {/* QR Code Display */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4 border-2 border-dashed border-gray-300 overflow-hidden">
                {qrCodeDataURL ? (
                  <img 
                    src={qrCodeDataURL} 
                    alt="QR Code" 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center">
                    <QrCode className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs lg:text-sm font-medium text-gray-600">{shopName}</p>
                    <p className="text-xs text-gray-500">Generating QR Code...</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 lg:space-y-3">
                <button 
                  onClick={handleDownload}
                  disabled={!qrCodeDataURL}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center space-x-1 lg:space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-2 lg:px-3 text-xs lg:text-sm rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 lg:w-4 lg:h-4" /> : <Copy className="w-3 h-3 lg:w-4 lg:h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-1 lg:space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium py-2 px-2 lg:px-3 text-xs lg:text-sm rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* QR Scanner Button */}
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
              </div>

              {/* Usage Stats */}
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-2 lg:mb-3">Usage Statistics</h4>
                <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scans this month</span>
                    <span className="font-medium text-gray-900">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New customers</span>
                    <span className="font-medium text-emerald-600">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success rate</span>
                    <span className="font-medium text-blue-600">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Basic Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Basic Settings</h3>
              
              <div className="space-y-3 lg:space-y-4">
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter your shop name"
                    className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                    QR Code URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={generateQRCode()}
                      readOnly
                      className="flex-1 px-3 py-2 text-xs lg:text-sm border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 lg:px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg transition-colors duration-200 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600" /> : <Copy className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Style Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Style Options</h3>
              
              <div className="grid sm:grid-cols-3 gap-3 lg:gap-4">
                {Object.entries(qrStyles).map(([key, style]) => (
                  <div
                    key={key}
                    onClick={() => setQrStyle(key as 'standard' | 'branded' | 'premium')}
                    className={`relative p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      qrStyle === key
                        ? `border-${style.color}-500 bg-${style.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-${style.color}-100 rounded-lg mb-2 lg:mb-3`}>
                        {key === 'standard' && <QrCode className={`w-5 h-5 lg:w-6 lg:h-6 text-${style.color}-600`} />}
                        {key === 'branded' && <Palette className={`w-5 h-5 lg:w-6 lg:h-6 text-${style.color}-600`} />}
                        {key === 'premium' && <Zap className={`w-5 h-5 lg:w-6 lg:h-6 text-${style.color}-600`} />}
                      </div>
                      <h4 className={`text-sm lg:text-base font-semibold text-gray-900 mb-1`}>{style.name}</h4>
                      <p className="text-xs lg:text-sm text-gray-600 mb-1 lg:mb-2">{style.description}</p>
                      <p className={`text-xs lg:text-sm font-semibold text-${style.color}-600`}>{style.price}</p>
                    </div>
                    
                    {qrStyle === key && (
                      <div className={`absolute top-2 right-2 w-4 h-4 lg:w-5 lg:h-5 bg-${style.color}-500 rounded-full flex items-center justify-center`}>
                        <Check className="w-2 h-2 lg:w-3 lg:h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">How to Use</h3>
              
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-start space-x-2 lg:space-x-3">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-emerald-100 rounded-full text-emerald-600 font-semibold text-xs lg:text-sm flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Download & Print</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Download your QR code and print it on stickers or posters</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 lg:space-x-3">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-emerald-100 rounded-full text-emerald-600 font-semibold text-xs lg:text-sm flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Display at Your Shop</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Place QR codes at your entrance, counter, or waiting area</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 lg:space-x-3">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-emerald-100 rounded-full text-emerald-600 font-semibold text-xs lg:text-sm flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Customers Scan</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Customers scan with their phone camera to check-in automatically</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 lg:space-x-3">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-emerald-100 rounded-full text-emerald-600 font-semibold text-xs lg:text-sm flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Scan Customer QR Codes</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Use the scanner to read customer QR codes for quick check-ins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Prompt */}
            {qrStyle !== 'standard' && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                <div className="flex items-start space-x-2 lg:space-x-3">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">Upgrade to {qrStyles[qrStyle].name}</h4>
                    <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">{qrStyles[qrStyle].description} starting at {qrStyles[qrStyle].price}</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 lg:px-4 text-xs lg:text-sm rounded-lg transition-colors duration-200 cursor-pointer">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Scan QR Code</h3>
              <button
                onClick={stopCamera}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              {!isScanning ? (
                <div className="text-center">
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <button
                    onClick={startCamera}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Start Camera
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg pointer-events-none">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Position QR code within the frame</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={stopCamera}
                      className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={simulateQRScan}
                      className="flex-1 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Simulate Scan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};