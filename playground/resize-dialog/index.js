import * as Util from '../../src/utils/resizeAndMove.js';

window.addEventListener('load', () => {
  const dialog = Util.createResizableContainer('dialog', {
    position: 'fixed',
    left: '200px',
    top: '200px',
    width: '300px',
    overflow: 'auto'
  });
  dialog.innerHTML = `<p>
    Once upon a time in a quaint little village nestled between rolling hills and meandering streams, there lived a curious young girl named Lily. With her sparkling blue eyes and a mop of unruly golden curls, Lily was known for her insatiable thirst for adventure.

    One sunny afternoon, as Lily wandered through the enchanted forest that bordered her village, she stumbled upon a mysterious old book lying beneath a gnarled oak tree. Intrigued, she opened its weathered pages and discovered a map that promised to lead to a hidden realm of magic.

    Driven by excitement, Lily embarked on a journey that took her through dark, mystical woods and across shimmering fields of wildflowers. Along the way, she encountered fantastical creatures and faced challenges that tested her courage and wit.

    As she reached the heart of the hidden realm, Lily discovered a magical fountain with water that shimmered like liquid diamonds. Legend had it that anyone who drank from the fountain would be granted a single wish. Lily closed her eyes and made her wish with all her heart.

    To her amazement, when she opened her eyes, she found herself back in her village, but everything seemed brighter, and the air was filled with a sense of wonder. The once dull colors now danced with vibrancy, and the villagers wore smiles that mirrored her own.

    Lily realized that her wish had not only transformed her world but had also brought magic and joy to everyone around her. From that day forward, the little village thrived with a newfound enchantment, all thanks to the adventurous spirit and kind heart of a girl named Lily.
  </p>`;
  Util.addMoveController(dialog, dialog);
  document.body.append(dialog);
});
