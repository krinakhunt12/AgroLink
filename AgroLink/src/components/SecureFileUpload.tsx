import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

/**
 * SECURE FILE UPLOAD COMPONENT
 * 
 * Features:
 * - Client-side validation before upload
 * - File type and size validation
 * - Drag and drop support
 * - Image preview
 * - Upload progress
 * - Error handling
 * - Multiple file support
 */

interface SecureFileUploadProps {
    uploadType?: 'product' | 'profile';
    multiple?: boolean;
    maxFiles?: number;
    onUploadSuccess?: (files: any[]) => void;
    onUploadError?: (error: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_FILE_SIZE = 1024; // 1KB

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
    uploadType = 'product',
    multiple = false,
    maxFiles = 5,
    onUploadSuccess,
    onUploadError
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Validate file on client side
     */
    const validateFile = (file: File): string | null => {
        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `Invalid file type: ${file.name}. Allowed types: JPG, PNG, WebP`;
        }

        // Check file extension
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return `Invalid file extension: ${file.name}. Allowed: JPG, PNG, WebP`;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File too large: ${file.name}. Maximum size: 5MB`;
        }

        if (file.size < MIN_FILE_SIZE) {
            return `File too small: ${file.name}. Minimum size: 1KB`;
        }

        // Check filename for suspicious patterns
        if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
            return `Invalid filename: ${file.name}`;
        }

        return null;
    };

    /**
     * Handle file selection
     */
    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const errors: string[] = [];
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        // Validate each file
        Array.from(files).forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                validFiles.push(file);
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === validFiles.length) {
                        setPreviews(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Check max files limit
        if (selectedFiles.length + validFiles.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed`);
            setValidationErrors(errors);
            return;
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            toast.error(`${errors.length} file(s) failed validation`);
        }

        if (validFiles.length > 0) {
            setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
            setValidationErrors([]);
        }
    };

    /**
     * Handle file input change
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    /**
     * Handle drag and drop
     */
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    /**
     * Remove file from selection
     */
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    /**
     * Upload files to server
     */
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();

            if (multiple) {
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });
            } else {
                formData.append('image', selectedFiles[0]);
            }

            const endpoint = uploadType === 'profile'
                ? '/upload/profile'
                : multiple
                    ? '/upload/product'
                    : '/upload/product/single';

            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);

                // Call success callback
                if (onUploadSuccess) {
                    const files = response.data.files || [response.data.file];
                    onUploadSuccess(files);
                }

                // Reset
                setSelectedFiles([]);
                setPreviews([]);
                setValidationErrors([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }

        } catch (error: any) {
            console.error('[UPLOAD-ERROR]', error);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.errors?.join(', ')
                || 'Upload failed. Please try again.';

            toast.error(errorMessage);

            if (onUploadError) {
                onUploadError(errorMessage);
            }

            // Show specific errors
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            }

        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="secure-file-upload">
            {/* Upload Area */}
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    multiple={multiple}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    <Upload size={48} />
                </div>

                <h3>
                    {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
                </h3>

                <p className="upload-hint">
                    Allowed: JPG, PNG, WebP • Max size: 5MB • Max files: {maxFiles}
                </p>

                {/* Security Badge */}
                <div className="security-badge">
                    <CheckCircle size={16} />
                    <span>Secure Upload: Validated & Scanned</span>
                </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="validation-errors">
                    <AlertCircle size={20} />
                    <div>
                        <strong>Validation Errors:</strong>
                        <ul>
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h4>Selected Files ({selectedFiles.length})</h4>
                    <div className="file-previews">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="file-preview">
                                {previews[index] ? (
                                    <img src={previews[index]} alt={file.name} />
                                ) : (
                                    <ImageIcon size={48} />
                                )}
                                <div className="file-info">
                                    <p className="file-name">{file.name}</p>
                                    <p className="file-size">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <button
                        type="button"
                        className="upload-btn"
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                    >
                        {uploading ? (
                            <>
                                <Loader className="spinner" size={20} />
                                Uploading... {uploadProgress}%
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Upload {selectedFiles.length} File(s)
                            </>
                        )}
                    </button>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .secure-file-upload {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .upload-area {
                    border: 2px dashed #cbd5e0;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #f7fafc;
                }

                .upload-area:hover {
                    border-color: #4299e1;
                    background: #ebf8ff;
                }

                .upload-area.dragging {
                    border-color: #48bb78;
                    background: #f0fff4;
                }

                .upload-icon {
                    color: #4299e1;
                    margin-bottom: 16px;
                }

                .upload-hint {
                    color: #718096;
                    font-size: 14px;
                    margin-top: 8px;
                }

                .security-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: #c6f6d5;
                    color: #22543d;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                }

                .validation-errors {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                    padding: 16px;
                    background: #fff5f5;
                    border: 1px solid #fc8181;
                    border-radius: 8px;
                    color: #c53030;
                }

                .validation-errors ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                }

                .selected-files {
                    margin-top: 24px;
                }

                .file-previews {
                    display: grid;
                    gap: 12px;
                    margin-top: 16px;
                }

                .file-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }

                .file-preview img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .file-info {
                    flex: 1;
                    text-align: left;
                }

                .file-name {
                    font-weight: 500;
                    margin: 0;
                    font-size: 14px;
                }

                .file-size {
                    color: #718096;
                    margin: 4px 0 0 0;
                    font-size: 13px;
                }

                .remove-btn {
                    padding: 8px;
                    background: #fed7d7;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    color: #c53030;
                    transition: background 0.2s;
                }

                .remove-btn:hover:not(:disabled) {
                    background: #fc8181;
                    color: white;
                }

                .upload-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    margin-top: 16px;
                    padding: 12px 24px;
                    background: #4299e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .upload-btn:hover:not(:disabled) {
                    background: #3182ce;
                }

                .upload-btn:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    margin-top: 12px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4299e1, #48bb78);
                    transition: width 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default SecureFileUpload;
