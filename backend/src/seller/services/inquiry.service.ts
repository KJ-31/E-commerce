import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
  ) {}

  async findAllBySeller(sellerId: number): Promise<Inquiry[]> {
    return this.inquiryRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, sellerId: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOne({
      where: { id, seller: { id: sellerId } },
      relations: ['product'],
    });
    
    if (!inquiry) {
      throw new NotFoundException('문의를 찾을 수 없습니다');
    }
    
    return inquiry;
  }

  async answer(id: number, answer: string, sellerId: number): Promise<Inquiry> {
    const inquiry = await this.findOne(id, sellerId);
    inquiry.answer = answer;
    inquiry.isAnswered = true;
    return this.inquiryRepository.save(inquiry);
  }

  async getUnansweredCount(sellerId: number): Promise<number> {
    return this.inquiryRepository.count({
      where: {
        seller: { id: sellerId },
        isAnswered: false,
      },
    });
  }
}