import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { cloneElement, useState } from 'react';

export default function Modal({open, onClose, title, subtitle, children}) {

    if (!open) return null;

    return <>
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-40 animate-fade-in">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className="w-full max-w-md rounded-xl 
                                bg-white bg-opacity-80 backdrop-blur-sm border border-orange-200 shadow-custom
                                p-6 data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <DialogTitle as="h3" className="text-2xl font-bold text-orange-600">
                                    {title}
                                </DialogTitle>
                                <p className="text-orange-600 text-sm mt-1">{subtitle}</p>
                            </div>
                            
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-red-600 hover:text-red-800 focus:outline-none ml-4"
                            >
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>


                        {children && cloneElement(children, { onClose })}

                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    </>
}
