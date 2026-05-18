declare module 'docx-preview' {
  export function renderAsync(file: Blob, element: HTMLElement): Promise<void>
}
