import React, {useEffect, useRef} from 'react';

interface IFileInput {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileInput: React.FC<IFileInput> = ({file, setFile}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
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
    <div style={{width: '100%'}}>
      <div
        style={{
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          border: '1px dashed gray',
          backgroundColor: `${file ? '#f9faff' : 'transparent'}`,
          marginBottom: '15px',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={uploadRef}
      >
        {!file ? (
          <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: '1rem', cursor: 'pointer'}}
            onClick={() => inputRef.current?.click()}
          >
            <input type='file' onChange={(event) => setFile(event.target.files![0])} hidden ref={inputRef} />
            <p>Search in Folders</p>
          </div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 1rem'}}>
            <p style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>{file?.name}</p>
            <button
              style={{
                padding: '5px',
              }}
              onClick={() => {
                setFile(null);
              }}
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
