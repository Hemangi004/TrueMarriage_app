import { Request, Response } from 'express';

// In-memory store for biodata profiles
const biodataStore = new Map<string, any>();

export const saveBiodata = (req: Request, res: Response) => {
  try {
    const formData = req.body;
    const profileId = formData.id || 'draft-profile-1';
    
    biodataStore.set(profileId, {
      ...formData,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Biodata draft saved successfully',
      profileId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save biodata draft' });
  }
};

export const getBiodata = (req: Request, res: Response) => {
  const { id } = req.params;
  const data = biodataStore.get(id);

  if (!data) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  res.status(200).json({ success: true, data });
};

export const publishBiodata = (req: Request, res: Response) => {
  try {
    const formData = req.body;
    const profileId = `SOUL-${Math.floor(100000 + Math.random() * 900000)}`;

    biodataStore.set(profileId, {
      ...formData,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    });

    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    res.status(200).json({
      success: true,
      message: 'Biodata published successfully!',
      profileId,
      shareableUrl: `${frontendBase}/profile/${profileId}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to publish profile' });
  }
};
