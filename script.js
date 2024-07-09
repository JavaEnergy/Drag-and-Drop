
const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '300px',
    width: 'auto',
    storageManager: {
        type: 'local', // Use local storage
        autosave: true, // Enable autosave
        autoload: true, // Enable autoload
        stepsBeforeSave: 1, // Save after each change
    },
    panels: { defaults: [] },
    blockManager: {
        appendTo: '#blocks',
        blocks: [
            {
                id: 'section',
                label: '<b>Section</b>',
                attributes: { class: 'gjs-block-section' },
                content: `<section>
                    <h1>This is a simple title</h1>
                    <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                </section>`,
            },
            {
                id: 'text',
                label: 'Text',
                content: '<div data-gjs-type="text">Insert your text here</div>',
            },
            {
                id: 'image',
                label: 'Image',
                select: true,
                content: { type: 'image' },
                activate: true,
            },
            {
                id: 'static-content',
                label: 'Static Content',
                content: {
                    tagName: 'div',
                    draggable: false,
                    attributes: { 'some-attribute': 'some-value' },
                    components: [
                        {
                            tagName: 'span',
                            content: '<b>Some static content</b>',
                        },
                        {
                            tagName: 'div',
                            components: '<span>HTML at some point</span>',
                        }
                    ],
                },
            }
        ]
    },

    layerManager: {
        appendTo: '.layers-container'
      },
      // We define a default panel as a sidebar to contain layers
      panels: {
        defaults: [{
          id: 'layers',
          el: '.panel__right',
          // Make the panel resizable
          resizable: {
            maxDim: 350,
            minDim: 200,
            tc: 0, // Top handler
            cl: 1, // Left handler
            cr: 0, // Right handler
            bc: 0, // Bottom handler
            // Being a flex child we need to change `flex-basis` property
            // instead of the `width` (default)
            keyWidth: 'flex-basis',
          },
        }]
      }
    });

// Wait for the editor to be fully loaded
editor.on('load', () => {
    // Select the inner component
    const wrapper = editor.DomComponents.getWrapper();
    const myComponent = wrapper.find('.my-component')[0];

    // Replace the component's children with new content
    myComponent.components('<div>New content</div>');

    // Optional: Do something with each child component
    myComponent.components().forEach(component => {
        console.log(component.toHTML());
    });
});

// Add panels and buttons
editor.Panels.addPanel({
    id: 'panel-top',
    el: '.panel__top',
});

editor.Panels.addPanel({
    id: 'basic-actions',
    el: '.panel__basic-actions',
    buttons: [
        {
            id: 'visibility',
            active: true, // active by default
            className: 'btn-toggle-borders',
            label: '<u>B</u>',
            command: 'sw-visibility', // Built-in command
        },
        {
            id: 'export',
            className: 'btn-open-export',
            label: 'Exp',
            command: 'export-template',
            context: 'export-template', // For grouping context of buttons from the same panel
        },
        {
            id: 'show-json',
            className: 'btn-show-json',
            label: 'JSON',
            context: 'show-json',
            command(editor) {
                editor.Modal.setTitle('Components JSON')
                    .setContent(`<textarea style="width:100%; height: 250px;">
                        ${JSON.stringify(editor.getComponents())}
                    </textarea>`)
                    .open();
            },
        }
    ],
});
editor.on('run:export-template:before', opts => {
    console.log('Before the command run');
    if (0 /* some condition */) {
      opts.abort = 1;
    }
  });
  editor.on('run:export-template', () => console.log('After the command run'));
  editor.on('abort:export-template', () => console.log('Command aborted'));