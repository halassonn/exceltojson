import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { UploadMetadata } from './core/before-upload.interface';
import { ImageService } from './core/image.service';
import { Style } from './core/Style';


export class FileHolder {
    public pending = false;
    public serverResponse: { status: number, response: any };
    constructor(public src: string, public file: File) {
    }
}

@Component({
    selector: 'app-imguploader',
    templateUrl: '_imageUploader.html',
    styleUrls: ['_imageUploader.css']
})

export class ImageUploadComponent implements OnInit, OnChanges {
    files: FileHolder[] = [];
    fileCounter = 0;
    fileOver = false;
    showFileTooLargeMessage = false;
    @Input() beforeUpload: (param: UploadMetadata) => UploadMetadata | Promise<UploadMetadata> = data => data;
    // tslint:disable-next-line:member-ordering
    @Input() buttonCaption = 'Select Images';
    // tslint:disable-next-line:member-ordering
    @Input() disabled = false;
    @Input('class') cssClass = 'img-ul';
    @Input() clearButtonCaption = 'Clear';
    @Input() dropBoxMessage = 'Drop your images here!';
    @Input() fileTooLargeMessage;
    @Input() headers: Headers | { [name: string]: any };
    @Input() max = 100;
    @Input() maxFileSize: number;
    @Input() preview = true;
    @Input() partName: string;
    @Input() style: Style;
    @Input('extensions') supportedExtensions: string[];
    @Input() url: string;
    @Input() withCredentials = false;
    @Input() uploadedFiles: string[] | Array<{ url: string, fileName: string, blob?: Blob }> = [];
    @Output() removed = new EventEmitter<FileHolder>();
    @Output() uploadStateChanged = new EventEmitter<boolean>();
    @Output() uploadFinished = new EventEmitter<FileHolder>();
    @Output() previewClicked = new EventEmitter<FileHolder>();

    // tslint:disable-next-line:member-ordering
    @ViewChild('input')
    private inputElement: ElementRef;
    // tslint:disable-next-line:member-ordering
    private pendingFilesCounter = 0;

    constructor(private imageService: ImageService) {
    }

    ngOnInit() {
        if (!this.fileTooLargeMessage) {
            this.fileTooLargeMessage = 'An image was too large and was not uploaded.' +
                (this.maxFileSize ? (' The maximum file size is ' + this.maxFileSize / 1024) + 'KiB.' : '');
        }
        this.supportedExtensions = this.supportedExtensions ? this.supportedExtensions.map((ext) => 'image/' + ext) : ['image/*'];
    }

    deleteAll() {
        this.files.forEach(f => this.removed.emit(f));
        this.files = [];
        this.fileCounter = 0;
        this.inputElement.nativeElement.value = '';
    }

    deleteFile(file: FileHolder): void {
        const index = this.files.indexOf(file);
        this.files.splice(index, 1);
        this.fileCounter--;
        this.inputElement.nativeElement.value = '';
        this.removed.emit(file);
    }

    previewFileClicked(file: FileHolder) {
        this.previewClicked.emit(file);
    }

    ngOnChanges(changes) {
        if (changes.uploadedFiles && changes.uploadedFiles.currentValue.length > 0) {
            //this.processUploadedFiles();
        }
    }

    onFileChange(files: FileList) {
        if (this.disabled) { return; }

        const remainingSlots = this.countRemainingSlots();
        const filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;

        if (this.url && filesToUploadNum !== 0) {
            this.uploadStateChanged.emit(true);
        }

        this.fileCounter += filesToUploadNum;
        this.showFileTooLargeMessage = false;
        this.uploadFiles(files, filesToUploadNum);
    }

    onFileOver = (isOver) => this.fileOver = isOver;

    private countRemainingSlots = () => this.max - this.fileCounter;

    private onResponse(response: Response, fileHolder: FileHolder) {
        fileHolder.serverResponse = { status: response.status, response };
        fileHolder.pending = false;

        this.uploadFinished.emit(fileHolder);

        if (--this.pendingFilesCounter === 0) {
            this.uploadStateChanged.emit(true);
        }
    }

    private processUploadedFiles() {
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            const data: any = this.uploadedFiles[i];

            let fileBlob: Blob,
                file: File,
                fileUrl: string;

            if (data instanceof Object) {
                fileUrl = data.url;
                fileBlob = (data.blob) ? data.blob : new Blob([data]);
                file = new File([fileBlob], data.fileName);
            } else {
                fileUrl = data;
                fileBlob = new Blob([fileUrl]);
                file = new File([fileBlob], fileUrl);
            }

            this.files.push(new FileHolder(fileUrl, file));
        }
    }

    private async uploadFiles(files: FileList, filesToUploadNum: number) {
        for (let i = 0; i < filesToUploadNum; i++) {
            const file = files[i];
            this.fileCounter--;
            this.inputElement.nativeElement.value = '';
            if (this.maxFileSize && file.size > this.maxFileSize) {
                this.fileCounter--;
                this.inputElement.nativeElement.value = '';
                this.showFileTooLargeMessage = true;
                continue;
            }

            const beforeUploadResult: UploadMetadata = await this.beforeUpload({ file, url: this.url, abort: false });
            console.log(beforeUploadResult);
            if (beforeUploadResult.abort) {
                this.fileCounter--;
                this.inputElement.nativeElement.value = '';
                continue;
            }
            const img = document.createElement('img');
            console.log(img);
            img.src = window.URL.createObjectURL(beforeUploadResult.file);

            const reader = new FileReader();
            reader.addEventListener('load', (event: any) => {
                const fileHolder: FileHolder = new FileHolder(event.target.result, beforeUploadResult.file);
                this.uploadSingleFile(fileHolder, beforeUploadResult.url, beforeUploadResult.formData);
                this.files.push(fileHolder);
            }, false);
            reader.readAsDataURL(beforeUploadResult.file);
        }
    }

    private uploadSingleFile(fileHolder: FileHolder, url = this.url, customForm?: { [name: string]: any }) {
        if (url) {
            this.pendingFilesCounter++;
            fileHolder.pending = true;

            this.imageService
                .postImage(url, fileHolder.file, this.headers, this.partName, customForm, this.withCredentials)
                .subscribe(
                    response => this.onResponse(response, fileHolder),
                    error => {
                        this.onResponse(error, fileHolder);
                        this.deleteFile(fileHolder);
                    });
        } else {
            this.uploadFinished.emit(fileHolder);
        }
    }
}


