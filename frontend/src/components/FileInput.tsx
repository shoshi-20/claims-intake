import React, {useEffect, useRef} from 'react';

interface IFileInput {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileInput: React.FC<IFileInput> = ({file, setFile}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragActive(false);
    const items = Array.from(event.dataTransfer.items).filter((item) => item.kind === 'file');
    if (items.length > 1) {
      alert('Please upload only one file');
      return;
    }
    const entry = items[0].webkitGetAsEntry();
    if (entry && entry.isDirectory) {
      alert('Folders are not allowed');
      return;
    }
    const file = items[0].getAsFile();
    if (file) setFile(file);
  };

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      if (!uploadRef.current?.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener('drop', handleDrop, true);
    return () => document.removeEventListener('drop', handleDrop, true);
  }, [file]);

  return (
    <div>
      <div
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${file ? 'dropzone-filled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={uploadRef}
      >
        {!file ? (
          <button type='button' className='dropzone-trigger' onClick={() => inputRef.current?.click()}>
            <input type='file' onChange={(event) => setFile(event.target.files![0])} hidden ref={inputRef} />
            Choose or drag a document here
          </button>
        ) : (
          <div className='dropzone-file-row'>
            <p className='dropzone-filename'>{file.name}</p>
            <button type='button' className='dropzone-remove' onClick={() => setFile(null)}>
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
