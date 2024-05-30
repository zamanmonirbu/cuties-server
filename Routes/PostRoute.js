import express from 'express';
import { createPost, getTimelinePost, post, postDelete, postLike, postUpdate } from '../Controllers/PostController.js';

const router= express.Router();

router.post('/create',createPost)
router.get('/:id',post);
router.put('/:id',postUpdate);
router.delete('/:id',postDelete);
router.put('/:id/like',postLike);
router.get('/:id/timeline',getTimelinePost);

export default router;